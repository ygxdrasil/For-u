#!/usr/bin/env node
/**
 * Grace's hands on your home network.
 *
 * Grace lives in a data centre. A PlayStation answers to nothing but the local
 * network — waking one is a UDP broadcast, and no amount of cloud will put her
 * on your Wi-Fi. So this runs on the laptop that is already switched on in the
 * room, and does the two things she cannot.
 *
 * It only ever dials out. Nothing here listens on a port, so there is no
 * router to reconfigure and nothing on your network is reachable from outside.
 * Every few seconds it asks Grace whether she left an instruction, carries it
 * out, and tells her what happened.
 *
 * Run it with:  npm start
 */

import {spawn} from 'node:child_process';
import dgram from 'node:dgram';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname, join} from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));

function settings() {
  let file = {};
  try {
    file = JSON.parse(readFileSync(join(here, 'config.json'), 'utf8'));
  } catch {
    // Environment variables alone are a perfectly good way to run this.
  }

  const grace = process.env.GRACE_URL ?? file.grace ?? '';
  const token = process.env.GRACE_BRIDGE_TOKEN ?? file.token ?? '';

  if (!grace || !token) {
    console.error(
      '\nI need to know where Grace is and how to prove I am yours.\n\n' +
        'Copy config.example.json to config.json and fill in both values.\n' +
        'The token is in Grace, under the side panel, "The laptop bridge".\n',
    );
    process.exit(1);
  }

  return {
    grace: grace.replace(/\/+$/, ''),
    token,
    /**
     * How often to ask for instructions.
     *
     * Every check is a request to Grace and a read of her memory, both of
     * which have monthly allowances on the free tiers she runs on. Fifteen
     * seconds is frequent enough that a console which takes twenty seconds to
     * boot feels immediate, and slow enough to be free.
     */
    everyMs: Number(process.env.GRACE_BRIDGE_POLL_MS ?? file.pollMs ?? 15_000),
    /** Set this if discovery finds the wrong device, or none. */
    ip: process.env.PS5_IP ?? file.ps5Ip ?? '',
  };
}

const config = settings();

// ---- finding the console ------------------------------------------------

/**
 * PlayStation discovery, spoken directly.
 *
 * A one-line UDP message on the port the console listens on. Doing this here
 * rather than shelling out means the state is fresh every single cycle, costs
 * nothing, and still answers when the wake tooling is unhappy — so Grace can
 * always say truthfully whether the console is on.
 */
const PS5_PORT = 9302;
const PROBE = 'SRCH * HTTP/1.1\ndevice-discovery-protocol-version:00030010\n';

function discover(timeoutMs = 2000) {
  return new Promise((resolve) => {
    const socket = dgram.createSocket({type: 'udp4', reuseAddr: true});
    let answered = null;

    const finish = () => {
      try {
        socket.close();
      } catch {
        // Already closed; nothing to do.
      }
      resolve(
        answered ?? {found: false, status: null, name: null, address: null, at: new Date().toISOString()},
      );
    };

    const timer = setTimeout(finish, timeoutMs);

    socket.on('message', (message, from) => {
      const text = message.toString('utf8');
      // The first line is an HTTP-shaped status: 200 means awake, 620 standby.
      const status = /^HTTP\/1\.1 (\d+)/.exec(text)?.[1];
      const fields = Object.fromEntries(
        text
          .split('\n')
          .slice(1)
          .map((line) => line.split(':'))
          .filter((pair) => pair.length >= 2)
          .map(([key, ...rest]) => [key.trim(), rest.join(':').trim()]),
      );

      answered = {
        found: true,
        status: status === '200' ? 'AWAKE' : 'STANDBY',
        name: fields['host-name'] ?? null,
        address: from.address,
        running: fields['running-app-name'] ?? null,
        at: new Date().toISOString(),
      };

      clearTimeout(timer);
      finish();
    });

    socket.on('error', () => {
      clearTimeout(timer);
      finish();
    });

    socket.bind(() => {
      socket.setBroadcast(true);
      const target = config.ip || '255.255.255.255';
      socket.send(PROBE, PS5_PORT, target, (error) => {
        if (error) {
          clearTimeout(timer);
          finish();
        }
      });
    });
  });
}

// ---- doing something about it -------------------------------------------

/**
 * Waking and sleeping go through playactor.
 *
 * Both need a credential the console only hands out during a pairing dance
 * involving a PIN typed on the television, and playactor already implements
 * all of it. Running it as a command rather than importing it keeps this file
 * honest about the boundary: everything above is protocol we speak ourselves,
 * everything here is a program we are asking politely.
 */
function playactor(command) {
  return new Promise((resolve) => {
    const args = [
      '--yes',
      'playactor',
      command,
      '--ps5',
      '--no-open-urls',
      ...(config.ip ? ['--ip', config.ip] : []),
    ];

    const child = spawn('npx', args, {cwd: here, shell: process.platform === 'win32'});

    let output = '';
    child.stdout.on('data', (chunk) => (output += chunk));
    child.stderr.on('data', (chunk) => (output += chunk));

    // A console that will not answer must not leave this hanging for ever;
    // Grace is waiting on the other end to be able to say what happened.
    const timer = setTimeout(() => child.kill(), 45_000);

    child.on('error', (error) => {
      clearTimeout(timer);
      resolve({ok: false, detail: `could not run playactor: ${error.message}`});
    });

    child.on('close', (code) => {
      clearTimeout(timer);
      const detail = output.trim().split('\n').slice(-2).join(' ').slice(0, 200);
      resolve({ok: code === 0, detail: code === 0 ? '' : detail || `exit ${code}`});
    });
  });
}

async function carryOut(action) {
  if (action === 'status') {
    const state = await discover();
    return {ok: state.found, detail: state.found ? `${state.status}` : 'no console answered'};
  }

  if (action === 'wake') return playactor('wake');
  if (action === 'sleep') return playactor('standby');

  return {ok: false, detail: `I do not know how to ${action}`};
}

// ---- the loop ------------------------------------------------------------

let lastState = null;
let quietSince = Date.now();

async function checkIn(results = []) {
  const state = await discover();
  lastState = state;

  const response = await fetch(`${config.grace}/api/bridge`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({token: config.token, state, results}),
  });

  if (response.status === 401) {
    console.error('Grace does not recognise this token. Check config.json.');
    return [];
  }
  if (!response.ok) throw new Error(`Grace answered ${response.status}`);

  const body = await response.json();
  return body.commands ?? [];
}

async function cycle() {
  const commands = await checkIn();
  if (commands.length === 0) {
    // A quiet line is worth saying once an hour, so a bridge that has silently
    // stopped working is distinguishable from one with nothing to do.
    if (Date.now() - quietSince > 60 * 60 * 1000) {
      quietSince = Date.now();
      console.log(
        `[${new Date().toLocaleTimeString()}] still here — console is ` +
          `${lastState?.found ? lastState.status : 'not answering'}`,
      );
    }
    return;
  }

  const results = [];
  for (const command of commands) {
    console.log(`[${new Date().toLocaleTimeString()}] ${command.action}`);
    const outcome = await carryOut(command.action);
    console.log(`  ${outcome.ok ? 'done' : `failed: ${outcome.detail}`}`);
    results.push({id: command.id, ok: outcome.ok, detail: outcome.detail});
  }

  // Reported on its own rather than waiting for the next cycle: Grace is
  // holding a conversation open waiting to hear how it went.
  await checkIn(results);
  quietSince = Date.now();
}

console.log(`Grace bridge — talking to ${config.grace}`);
const first = await discover();
console.log(
  first.found
    ? `Found ${first.name ?? 'a console'} at ${first.address}, currently ${first.status}.`
    : 'No console answered yet. That is normal if it is unplugged or on another network.',
);

for (;;) {
  try {
    await cycle();
  } catch (error) {
    // Wi-Fi drops, laptops sleep, Grace redeploys. None of that should end the
    // bridge — it should simply try again in a moment.
    console.error(`  trouble: ${error.message}`);
  }
  await new Promise((resolve) => setTimeout(resolve, config.everyMs));
}
