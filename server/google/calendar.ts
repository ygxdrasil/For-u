import {googleFetch} from './oauth';

const BASE = 'https://www.googleapis.com/calendar/v3/calendars/primary/events';

export interface Appointment {
  id: string;
  summary: string;
  location: string;
  start: string;
  end: string;
  allDay: boolean;
  attendees: string[];
}

interface RawEvent {
  id: string;
  summary?: string;
  location?: string;
  start?: {dateTime?: string; date?: string};
  end?: {dateTime?: string; date?: string};
  attendees?: {email?: string}[];
}

function shape(event: RawEvent): Appointment {
  const allDay = Boolean(event.start?.date);
  return {
    id: event.id,
    summary: event.summary ?? '(no title)',
    location: event.location ?? '',
    start: event.start?.dateTime ?? event.start?.date ?? '',
    end: event.end?.dateTime ?? event.end?.date ?? '',
    allDay,
    attendees: (event.attendees ?? [])
      .map((attendee) => attendee.email ?? '')
      .filter(Boolean),
  };
}

/**
 * What is coming up.
 *
 * singleEvents expands repeating entries into their actual instances, which is
 * both what a person means by "what's on today" and a requirement for ordering
 * by start time.
 */
export async function upcoming(hours = 24, limit = 20): Promise<Appointment[]> {
  const from = new Date();
  const to = new Date(from.getTime() + hours * 3600_000);

  const params = new URLSearchParams({
    timeMin: from.toISOString(),
    timeMax: to.toISOString(),
    singleEvents: 'true',
    orderBy: 'startTime',
    maxResults: String(limit),
  });

  const response = (await googleFetch(`${BASE}?${params.toString()}`)) as {
    items?: RawEvent[];
  };
  return (response.items ?? []).map(shape);
}

/**
 * Put something in the diary.
 *
 * sendUpdates=none deliberately: inviting people is outbound communication,
 * and that is the user's to authorise, not Grace's. She can create the entry;
 * telling anyone about it is a separate act.
 */
export async function addAppointment(options: {
  summary: string;
  start: string;
  end: string;
  location?: string;
  description?: string;
  timeZone?: string;
}): Promise<Appointment> {
  const zone =
    options.timeZone ?? Intl.DateTimeFormat().resolvedOptions().timeZone ?? 'UTC';

  const created = (await googleFetch(`${BASE}?sendUpdates=none`, {
    method: 'POST',
    body: JSON.stringify({
      summary: options.summary,
      location: options.location,
      description: options.description,
      start: {dateTime: options.start, timeZone: zone},
      end: {dateTime: options.end, timeZone: zone},
    }),
  })) as RawEvent;

  return shape(created);
}
