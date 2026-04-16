import { NextRequest, NextResponse } from 'next/server';
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

export async function GET(req: NextRequest) {
  const bookings = await readBookings();
  // Sort newest first
  bookings.sort((a, b) => (b.receivedAt || '').localeCompare(a.receivedAt || ''));
  return NextResponse.json({ bookings });
}
