import {requiresConfirmation} from '../actions';
import {noteDeed} from '../journal';
import {askTools} from './ask';
import {consoleTools} from './console';
import {googleTools} from './google';
import {keepTools} from './keep';
import {lightTools} from './lights';
import {openTools} from './open';
import {playstationTools} from './playstation';
import {recallTools} from './recall';
import {reminderTools} from './reminders';
import {selfTools} from './self';
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
  ...selfTools,
  ...lightTools,
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
  search_files: 'Looked through your documents',
  read_document: 'Read a document',
  write_document: 'Wrote a document',
  set_lights: 'Changed the lights',
  dim_lights: 'Dimmed the lights',
  colour_lights: 'Recoloured the lights',
  list_lights: 'Checked the lights',
  check_github: 'Checked GitHub',
  check_workflows: 'Checked the workflows',
  file_mail: 'Filed a message',
  label_mail: 'Labelled a message',
  mark_mail: 'Marked a message',
  change_diary: 'Moved something in the diary',
  pause_workflow: 'Changed a workflow',
  rerun_checks: 'Set the build running again',
  open_on_laptop: 'Put a page on the laptop',
  lock_laptop: 'Locked the laptop',
  remember_this: 'Kept something in mind',
  correct_memory: 'Corrected herself',
  set_attention: 'Changed how much she interrupts',
  make_room: 'Built a room',
  notify_phone: 'Reached your phone',
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

/**
 * What each tool needs before it can do anything at all.
 *
 * A tool whose service is not connected is worse than useless: it costs its
 * declaration on every single request, and when she does reach for it, it
 * answers "GitHub is not connected" — which she then has to explain. Leaving it
 * out is both cheaper and more honest, since she stops offering what she cannot
 * do.
 *
 * Anything not listed here always works, because it depends on nothing but her.
 */
const NEEDS: Record<string, keyof Available> = {
  check_mail: 'google',
  read_mail: 'google',
  draft_reply: 'google',
  file_mail: 'google',
  label_mail: 'google',
  mark_mail: 'google',
  check_diary: 'google',
  add_to_diary: 'google',
  change_diary: 'google',
  check_github: 'github',
  rerun_checks: 'github',
  check_workflows: 'n8n',
  pause_workflow: 'n8n',
  check_playstation: 'playstation',
  recent_games: 'playstation',
  wake_playstation: 'room',
  sleep_playstation: 'room',
  open_on_laptop: 'room',
  lock_laptop: 'room',
  notify_phone: 'phone',
  set_lights: 'lights',
  dim_lights: 'lights',
  colour_lights: 'lights',
  list_lights: 'lights',
};

export interface Available {
  google: boolean;
  github: boolean;
  n8n: boolean;
  /** The read-only PlayStation Network view. */
  playstation: boolean;
  /** The laptop bridge — the console's switch, and the laptop itself. */
  room: boolean;
  phone: boolean;
  lights: boolean;
}

/**
 * The shape Gemini wants for a function declaration.
 *
 * Given what is connected, the list narrows to what can actually run. Note what
 * this deliberately is not: a per-message guess at which tools this particular
 * sentence needs. That would save more on paper and cost more in practice —
 * Gemini's implicit cache discounts a repeated prompt prefix to a quarter, and
 * the prefix includes the tool list, so a list that changes every message turns
 * every request into a full-price one. What is connected changes when a key is
 * pasted, which is roughly never, so this stays cacheable.
 */
export function declarations(have?: Available) {
  const usable = have
    ? TOOLS.filter((tool) => {
        const needs = NEEDS[tool.name];
        return !needs || have[needs];
      })
    : TOOLS;

  return usable.map((tool) => {
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
