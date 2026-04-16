import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), '..', '..', '..', 'data');
const BOOKINGS_LOG = path.join(DATA_DIR, 'bookings.jsonl');

async function readBookings() {
  try {
    const content = await fs.readFile(BOOKINGS_LOG, 'utf8');
    return content
      .split('\n')
      .filter(Boolean)
      .map((line) => JSON.parse(line));
  } catch {
    return [];
  }
}

export async function GET() {
  const bookings = await readBookings();
  const blockedDates = Array.from(
    new Set(
      bookings
        .map((b) => (b.date || '').trim())
        .filter((d) => d && d !== 'Invalid Date')
    )
  );

  return NextResponse.json({ blockedDates });
}
