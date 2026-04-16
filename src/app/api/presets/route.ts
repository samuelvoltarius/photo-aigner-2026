import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const PRESETS_PATH = path.join(process.cwd(), 'src', 'data', 'jobPresets.json');

export async function GET() {
  try {
    const raw = await fs.readFile(PRESETS_PATH, 'utf8');
    const data = JSON.parse(raw);
    return NextResponse.json(data);
  } catch (err) {
    console.error('Failed to read job presets:', err);
    return NextResponse.json({ error: 'Failed to read job presets' }, { status: 500 });
  }
}
