import {requiresConfirmation} from '../actions';
import {noteDeed} from '../journal';
import {askTools} from './ask';
import {consoleTools} from './console';
import {googleTools} from './google';
import {keepTools} from './keep';
import {openTools} from './open';
import {playstationTools} from './playstation';
import {recallTools} from './recall';
import {reminderTools} from './reminders';
import {timerTools} from './timers';
import {webTools} from './web';
import {workTools} from './work';
import type {Tool, ToolCall, ToolOutcome} from './types';

/**
 * Everything Grace can actually do.
 *
 * Two things are true of this list and must stay true. Nothing in it sends a
 * message or spends money — those are the user's absolute limits and there is
 * no tool for them at all, so there is nothing to talk her past. And nothing in
 * it deletes: her instruction is that things are marked, filed, or archived,
 * never destroyed, because deletion is the one action that cannot be undone.
 */
const TOOLS: Tool[] = [
  ...webTools,
  ...reminderTools,
  ...googleTools,
  ...playstationTools,
  ...consoleTools,
  ...recallTools,
  ...askTools,
  ...openTools,
  ...keepTools,
  ...timerTools,
  ...workTools,
];

export function allTools(): Tool[] {
  return TOOLS;
}

export function findTool(name: string): Tool | undefined {
  return TOOLS.find((tool) => tool.name === name);
}

/** Words that would mean a tool destroys something. Checked, not trusted. */
const DESTRUCTIVE = /\b(delete|destroy|erase|purge|wipe|permanently remove)\b/i;

/**
 * Proves the two hard limits about the tool list itself, rather than about any
 * particular call. Run at startup and by the self-test.
 */
export function auditTools(): string[] {
  const problems: string[] = [];

  for (const tool of TOOLS) {
    if (tool.category === 'communication') {
      problems.push(`${tool.name} is a communication tool; she has no such power`);
    }
    if (tool.category === 'purchase') {
      problems.push(`${tool.name} would spend money`);
    }
    if (tool.destructive) {
      problems.push(`${tool.name} is marked destructive, and nothing may destroy`);
    }
    if (DESTRUCTIVE.test(tool.description) || DESTRUCTIVE.test(tool.name)) {
      problems.push(`${tool.name} describes itself as destroying something`);
    }
  }

  return problems;
}

/** Tool names read like function calls; the journal is read by a person. */
const LABELS: Record<string, string> = {
  search_web: 'Searched the web',
  add_reminder: 'Added to the list',
  list_reminders: 'Checked the list',
  complete_reminder: 'Marked something done',
  check_mail: 'Checked the mail',
  read_mail: 'Read an email',
  draft_reply: 'Wrote a draft',
  check_diary: 'Checked the diary',
  add_to_diary: 'Added to the diary',
  check_playstation: 'Looked at the PlayStation',
  recent_games: 'Checked recent games',
  wake_playstation: 'Switched the PlayStation on',
  sleep_playstation: 'Put the PlayStation to sleep',
  search_memory: 'Went back through the record',
  ask_choice: 'Asked you something',
  open_pages: 'Opened a page',
  open_workspace: 'Switched workspace',
  write_note: 'Added to a note',
  read_note: 'Read a note back',
  track_situation: 'Logged a development',
  list_situations: 'Checked what is open',
  resolve_situation: 'Marked something settled',
  set_timer: 'Started a timer',
  list_timers: 'Checked the timers',
  start_watch: 'Started watching something',
  list_watches: 'Checked the watches',
  stop_watch: 'Stopped a watch',
  check_github: 'Checked GitHub',
  check_workflows: 'Checked the workflows',
};

function label(name: string): string {
  return LABELS[name] ?? name.replace(/_/g, ' ');
}

/**
 * What the interface shows about an action.
 *
 * Emphatically not the tool's output. Checking the mail returns every subject
 * line in the inbox because the model needs to read them — putting that on
 * screen underneath her reply buried the reply itself under a wall of other
 * people's email. The user should see that she looked, not what she read.
 *
 * A short result is worth keeping, though: "Noted: ring the dentist" says more
 * than "Added to the list" and costs a line either way.
 */
function describe(name: string, result: string): string {
  const short = result.trim().split('\n')[0];
  return short.length > 0 && short.length <= 60 && !short.includes('  ')
    ? `${label(name)} — ${short}`
    : label(name);
}

/**
 * Run one call the model asked for.
 *
 * Everything that could go wrong here is returned as a readable sentence
 * rather than thrown: the model reads the result and has to be able to tell
 * the user what happened, and a stack trace tells it nothing.
 */
export async function runTool(call: ToolCall): Promise<ToolOutcome> {
  const tool = findTool(call.name);
  if (!tool) {
    return {
      name: call.name,
      ok: false,
      result: `There is no tool called ${call.name}.`,
      summary: `Tried to use a tool that doesn't exist (${call.name})`,
    };
  }

  const missing = tool.required.filter(
    (key) => call.args[key] === undefined || call.args[key] === '',
  );
  if (missing.length > 0) {
    return {
      name: tool.name,
      ok: false,
      result: `Missing: ${missing.join(', ')}. Ask the user for it.`,
      summary: `Needed more detail for ${tool.name}`,
    };
  }

  // The policy layer, finally load-bearing rather than advisory.
  if (await requiresConfirmation(tool.category, tool.destructive ?? false)) {
    return {
      name: tool.name,
      ok: false,
      result:
        `That needs the user's explicit go-ahead first. Describe exactly what ` +
        `you are about to do and ask them to confirm. Do not claim to have done it.`,
      summary: `Waiting on approval for ${tool.name}`,
    };
  }

  try {
    const result = await tool.run(call.args);
    // Everything she does goes on the record. An assistant who acts for you
    // and leaves no trace is asking to be taken on trust, and she shouldn't
    // have to be: the interface shows this list.
    await noteDeed('acted', describe(tool.name, result)).catch(() => {});
    // `result` is what the model reads; `summary` is what the user sees. They
    // used to be the same string, which is how an inbox ended up on screen.
    return {name: tool.name, ok: true, result, summary: describe(tool.name, result)};
  } catch (error) {
    const detail = (error as Error).message;
    console.error(`[grace] tool ${tool.name} failed:`, detail);
    return {
      name: tool.name,
      ok: false,
      result: `That didn't work: ${detail}. Tell the user plainly.`,
      summary: `${tool.name} failed`,
    };
  }
}

/** The shape Gemini wants for a function declaration. */
export function declarations() {
  return TOOLS.map((tool) => {
    const keys = Object.keys(tool.parameters);
    // A declaration with an empty properties object is malformed, and a
    // malformed declaration can take the whole tool list down with it.
    if (keys.length === 0) {
      return {name: tool.name, description: tool.description};
    }

    return {
      name: tool.name,
      description: tool.description,
      parameters: {
        type: 'OBJECT' as const,
        properties: Object.fromEntries(
          Object.entries(tool.parameters).map(([key, spec]) => [
            key,
            {
              type: spec.type.toUpperCase(),
              description: spec.description,
              ...(spec.values ? {enum: spec.values} : {}),
            },
          ]),
        ),
        required: tool.required,
      },
    };
  });
}
