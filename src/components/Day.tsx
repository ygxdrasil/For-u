import {
  AlertCircle,
  CalendarDays,
  Check,
  Gamepad2,
  Mail,
  Sparkles,
} from 'lucide-react';
import {useCallback, useEffect, useState, type ReactNode} from 'react';
import type {Concern, DayView} from '../../shared/types';
import * as api from '../lib/api';

/**
 * The three questions a dashboard exists to answer.
 *
 * What does my day look like. What needs me. What has she been doing. The
 * first two are the point of having an assistant at all; the third is what
 * makes one you can leave running — an assistant acting on your behalf with no
 * visible record is asking to be taken on trust, and she shouldn't have to be.
 */

const REFRESH_MS = 3 * 60 * 1000;

function clock(iso: string): string {
  const at = new Date(iso);
  if (Number.isNaN(at.getTime())) return '';
  return at.toLocaleTimeString('en-GB', {hour: '2-digit', minute: '2-digit'});
}

function ago(iso: string): string {
  const minutes = Math.round((Date.now() - new Date(iso).getTime()) / 60_000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  return hours < 24 ? `${hours}h ago` : `${Math.round(hours / 24)}d ago`;
}

function Section({
  title,
  count,
  children,
}: {
  title: string;
  count?: number;
  children: ReactNode;
}) {
  return (
    <div>
      <h3 className="mb-2 flex items-center gap-1.5 text-[0.62rem] uppercase tracking-[0.14em] text-mist/50">
        {title}
        {count !== undefined && count > 0 && (
          <span className="rounded-full bg-ice/15 px-1.5 text-[0.6rem] text-ice">
            {count}
          </span>
        )}
      </h3>
      {children}
    </div>
  );
}

function Row({
  icon,
  primary,
  secondary,
  tone = 'normal',
}: {
  icon: ReactNode;
  primary: string;
  secondary?: string;
  tone?: 'normal' | 'urgent';
}) {
  return (
    <li
      className={`arrive flex items-start gap-2 rounded-lg border px-3 py-2 text-xs leading-relaxed ${
        tone === 'urgent'
          ? 'attend border-ember/30 bg-ember/10 text-ember/90'
          : 'border-edge/60 bg-surface/30 text-slate-300'
      }`}>
      <span className="mt-0.5 shrink-0 text-mist/50">{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block break-words">{primary}</span>
        {secondary && (
          <span className="mt-0.5 block text-[0.65rem] text-mist/45">{secondary}</span>
        )}
      </span>
    </li>
  );
}

export function Day({
  /** Bumped whenever she has just looked around, so this follows her. */
  refreshKey,
  concerns,
  held,
}: {
  refreshKey: number | null;
  concerns: Concern[];
  held: string | null;
}) {
  const [day, setDay] = useState<DayView | null>(null);

  const load = useCallback(() => {
    api
      .fetchDay()
      .then((next) => next && setDay(next))
      .catch(() => {});
  }, []);

  useEffect(() => {
    load();
    const timer = window.setInterval(load, REFRESH_MS);
    return () => window.clearInterval(timer);
  }, [load]);

  // She has just noticed something; the panels below it are now out of date.
  useEffect(() => {
    if (refreshKey) load();
  }, [refreshKey, load]);

  if (!day) return null;

  const today = new Date().toDateString();
  const soon = day.events.filter(
    (event) => new Date(event.start).toDateString() === today,
  );

  const needsMe = [
    ...concerns.map((concern) => ({
      key: concern.id,
      text: concern.text,
      urgent: concern.urgency === 'now',
    })),
    ...day.reminders
      .filter((reminder) => reminder.due)
      .map((reminder) => ({
        key: reminder.id,
        text: reminder.text,
        urgent: new Date(reminder.due as string).getTime() < Date.now(),
      })),
  ]
    // The pulse and the list can name the same thing; showing it twice makes
    // her look like she has lost track of it.
    .filter(
      (item, index, all) => all.findIndex((other) => other.text === item.text) === index,
    )
    .slice(0, 6);

  return (
    <div className="flex flex-col gap-5">
      <Section title="My day">
        {soon.length === 0 && !day.playstation ? (
          <p className="rounded-lg border border-edge/60 bg-surface/30 px-3 py-2 text-xs text-mist/60">
            {day.google ? 'Nothing in the diary today.' : 'Diary not connected.'}
          </p>
        ) : (
          <ul className="space-y-1.5">
            {soon.map((event) => (
              <Row
                key={event.id}
                icon={<CalendarDays size={12} />}
                primary={event.summary}
                secondary={
                  event.allDay
                    ? 'All day'
                    : `${clock(event.start)}${event.location ? ` · ${event.location}` : ''}`
                }
              />
            ))}
            {day.playstation && (
              <Row
                icon={<Gamepad2 size={12} />}
                primary={
                  day.playstation.playing
                    ? `Playing ${day.playstation.playing}`
                    : day.playstation.online
                      ? 'PlayStation is on'
                      : 'PlayStation is off'
                }
                secondary={
                  day.playstation.playing
                    ? (day.playstation.platform ?? undefined)
                    : day.playstation.lastOnline
                      ? `Last on ${ago(day.playstation.lastOnline)}`
                      : undefined
                }
              />
            )}
          </ul>
        )}
      </Section>

      <Section title="What needs me" count={needsMe.length}>
        {needsMe.length === 0 ? (
          <p className="flex items-center gap-1.5 rounded-lg border border-edge/60 bg-surface/30 px-3 py-2 text-xs text-mist/60">
            <Check size={12} /> Nothing outstanding.
          </p>
        ) : (
          <ul className="space-y-1.5">
            {needsMe.map((item) => (
              <Row
                key={item.key}
                icon={<AlertCircle size={12} />}
                primary={item.text}
                tone={item.urgent ? 'urgent' : 'normal'}
              />
            ))}
          </ul>
        )}
        {held && (
          <p className="mt-1.5 text-[0.65rem] italic text-mist/45">{held}</p>
        )}
        {day.mail.length > 0 && (
          <p className="mt-1.5 text-[0.65rem] text-mist/45">
            <Mail size={10} className="mr-1 inline" />
            {day.mail.length} unread, newest from {day.mail[0].from.split('<')[0].trim()}
          </p>
        )}
      </Section>

      {day.deeds.length > 0 && (
        <Section title="What she’s been doing">
          <ul className="space-y-1.5">
            {day.deeds.slice(0, 6).map((deed) => (
              <Row
                key={deed.id}
                icon={<Sparkles size={12} />}
                primary={deed.text}
                secondary={`${ago(deed.at)}${deed.unprompted ? ' · on her own' : ''}`}
              />
            ))}
          </ul>
        </Section>
      )}
    </div>
  );
}
