import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), '..', '..', '..', 'data');
const BOOKINGS_LOG = path.join(DATA_DIR, 'bookings.jsonl');

function parseDate(dateStr?: string): Date | null {
  if (!dateStr) return null;
  const isoMatch = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    return new Date(parseInt(isoMatch[1]), parseInt(isoMatch[2]) - 1, parseInt(isoMatch[3]));
  }
  const euMatch = dateStr.match(/^(\d{1,2})[./](\d{1,2})[./](\d{4})/);
  if (euMatch) {
    return new Date(parseInt(euMatch[3]), parseInt(euMatch[2]) - 1, parseInt(euMatch[1]));
  }
  return new Date(dateStr);
}

function formatICalDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}${m}${d}`;
}

function escapeICalText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

function generateUID(index: number, date: string): string {
  return `booking-${index}-${date}@photo-aigner.at`;
}

export async function GET() {
  try {
    let lines: string[] = [];
    try {
      const raw = await fs.readFile(BOOKINGS_LOG, 'utf8');
      lines = raw.trim().split('\n').filter(Boolean);
    } catch {
      lines = [];
    }

    const bookings = lines.map((line, idx) => {
      try {
        return { ...JSON.parse(line), _index: idx };
      } catch {
        return null;
      }
    }).filter(Boolean);

    const events = bookings
      .filter((b: any) => b.date)
      .map((b: any) => {
        const date = parseDate(b.date);
        if (!date || isNaN(date.getTime())) return null;

        const dateStr = formatICalDate(date);
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);
        const endDateStr = formatICalDate(nextDay);

        const summary = escapeICalText(b.name || 'Buchung');
        const location = b.location ? escapeICalText(b.location) : '';
        const service = b.service ? `Service: ${b.service}` : '';
        const budget = b.budget ? `Budget: ${b.budget}` : '';
        const message = b.message ? `Nachricht: ${b.message}` : '';
        const notes = b.notes ? `Notizen: ${b.notes}` : '';
        const descParts = [service, budget, message, notes].filter(Boolean);
        const description = escapeICalText(descParts.join(' | '));

        const uid = generateUID(b._index, dateStr);

        return [
          'BEGIN:VEVENT',
          `UID:${uid}`,
          `DTSTART;VALUE=DATE:${dateStr}`,
          `DTEND;VALUE=DATE:${endDateStr}`,
          `SUMMARY:${summary}`,
          location ? `LOCATION:${location}` : null,
          description ? `DESCRIPTION:${description}` : null,
          'END:VEVENT'
        ].filter(Boolean).join('\r\n');
      })
      .filter(Boolean);

    const icalContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Photo Aigner//Bookings Dashboard//DE',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'X-WR-CALNAME:Photo Aigner Buchungen',
      ...events,
      'END:VCALENDAR'
    ].join('\r\n');

    return new NextResponse(icalContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': 'attachment; filename="photo-aigner-bookings.ics"'
      }
    });
  } catch (err) {
    console.error('Failed to generate iCal:', err);
    return NextResponse.json({ error: 'Failed to generate calendar' }, { status: 500 });
  }
}
