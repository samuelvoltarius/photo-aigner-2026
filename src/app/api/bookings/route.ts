import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const QUEUE_PATH = path.join(process.cwd(), '..', '..', '..', '.task-queue.json');
const NOTIFY_PATH = path.join(process.cwd(), '..', '..', '..', '.notify-queue.json');
const DATA_DIR = path.join(process.cwd(), '..', '..', '..', 'data');
const BOOKINGS_LOG = path.join(DATA_DIR, 'bookings.jsonl');

function generateId() {
  const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `BOOK-${date}-${rand}`;
}

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (err) {
    console.error('Failed to ensure data dir', err);
  }
}

async function appendBookingLog(booking: any) {
  try {
    await ensureDataDir();
    const line = JSON.stringify(booking) + '\n';
    await fs.appendFile(BOOKINGS_LOG, line, 'utf8');
  } catch (err) {
    console.error('Failed to append booking log', err);
  }
}

async function appendTask(entry: any) {
  try {
    const raw = await fs.readFile(QUEUE_PATH, 'utf8').catch(() => '{"tasks":[]}');
    const data = JSON.parse(raw || '{"tasks":[]}');
    data.tasks = data.tasks || [];
    data.tasks.push(entry);

    // Cleanup: keep pending tasks + last 200 completed booking tasks
    const pending = data.tasks.filter((t: any) => !(t.category === 'booking' && t.status === 'completed'));
    const completedBooking = data.tasks.filter((t: any) => t.category === 'booking' && t.status === 'completed');
    const keptCompleted = completedBooking.slice(-200);
    data.tasks = [...pending, ...keptCompleted];

    await fs.writeFile(QUEUE_PATH, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Failed to write task queue', err);
  }
}

async function enqueueNotify(message: string) {
  try {
    const raw = await fs.readFile(NOTIFY_PATH, 'utf8').catch(() => '[]');
    const arr = JSON.parse(raw || '[]');
    arr.push({ message, channel: 'whatsapp', timestamp: new Date().toISOString() });
    await fs.writeFile(NOTIFY_PATH, JSON.stringify(arr, null, 2));
  } catch (err) {
    console.error('Failed to write notify queue', err);
  }
}

// PUT: Notizen oder Status für Booking updaten
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { index, notes, status } = body;

    if (index === undefined || index === null) {
      return NextResponse.json({ error: 'index required' }, { status: 400 });
    }

    const idx = parseInt(String(index), 10);
    if (isNaN(idx) || idx < 0) {
      return NextResponse.json({ error: 'Invalid index' }, { status: 400 });
    }

    // Read current bookings from JSONL
    let lines: string[] = [];
    try {
      const raw = await fs.readFile(BOOKINGS_LOG, 'utf8');
      lines = raw.trim().split('\n').filter(Boolean);
    } catch {
      return NextResponse.json({ error: 'No bookings file found' }, { status: 404 });
    }

    if (idx >= lines.length) {
      return NextResponse.json({ error: 'Index out of range' }, { status: 404 });
    }

    // Update the booking with notes and/or status
    const booking = JSON.parse(lines[idx]);
    if (typeof notes === 'string') {
      booking.notes = notes;
    }
    if (status && ['pending', 'confirmed', 'cancelled'].includes(status)) {
      booking.status = status;
    }
    lines[idx] = JSON.stringify(booking);

    // Write back
    await fs.writeFile(BOOKINGS_LOG, lines.join('\n') + (lines.length ? '\n' : ''));

    return NextResponse.json({ ok: true, booking });
  } catch (err) {
    console.error('Failed to update booking:', err);
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
  }
}

// DELETE: Booking löschen (query param ?index=xxx)
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const indexStr = searchParams.get('index');

    if (indexStr === null) {
      return NextResponse.json({ error: 'index query param required' }, { status: 400 });
    }

    const index = parseInt(indexStr, 10);
    if (isNaN(index) || index < 0) {
      return NextResponse.json({ error: 'Invalid index' }, { status: 400 });
    }

    // Read current bookings from JSONL
    let lines: string[] = [];
    try {
      const raw = await fs.readFile(BOOKINGS_LOG, 'utf8');
      lines = raw.trim().split('\n').filter(Boolean);
    } catch {
      return NextResponse.json({ error: 'No bookings file found' }, { status: 404 });
    }

    if (index >= lines.length) {
      return NextResponse.json({ error: 'Index out of range' }, { status: 404 });
    }

    // Remove the booking at index
    const removed = JSON.parse(lines[index]);
    lines.splice(index, 1);

    // Write back
    await fs.writeFile(BOOKINGS_LOG, lines.join('\n') + (lines.length ? '\n' : ''));

    return NextResponse.json({ ok: true, removed });
  } catch (err) {
    console.error('Failed to delete booking:', err);
    return NextResponse.json({ error: 'Failed to delete booking' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // Nur name und date sind Pflicht für manuelle Einträge
    if (!body.name || typeof body.name !== 'string') {
      return NextResponse.json({ error: 'name erforderlich' }, { status: 400 });
    }
    if (!body.date) {
      return NextResponse.json({ error: 'date erforderlich' }, { status: 400 });
    }

    const booking = {
      name: body.name?.trim(),
      email: body.email?.trim() || '',
      phone: body.phone?.trim() || '',
      date: body.date || '',
      location: body.location || '',
      service: body.service || '',
      budget: body.budget || '',
      message: body.message?.trim() || '',
      whatsappConfirm: Boolean(body.whatsappConfirm),
      receivedAt: new Date().toISOString(),
      source: body.source || 'dashboard-manual',
      brand: 'CHILI',
    };

    const task = {
      id: generateId(),
      description: `Neue Booking-Anfrage von ${booking.name}`,
      priority: 'high',
      category: 'booking',
      status: 'pending',
      context: booking,
      submittedAt: booking.receivedAt,
      notify_on_complete: true,
    };

    await appendBookingLog(booking);
    await appendTask(task);

    const phoneInfo = booking.phone ? `Telefon: ${booking.phone}` : 'Telefon: —';
    const notifyMsg = [
      '📩 Neue Booking-Anfrage',
      `Name: ${booking.name}`,
      `E-Mail: ${booking.email}`,
      phoneInfo,
      booking.date ? `Datum: ${booking.date}` : 'Datum: —',
      booking.location ? `Ort: ${booking.location}` : 'Ort: —',
      booking.service ? `Leistung: ${booking.service}` : 'Leistung: —',
      booking.budget ? `Budget: ${booking.budget}` : 'Budget: —',
      `Nachricht: ${booking.message || ''}`,
      `Task-ID: ${task.id}`,
      booking.whatsappConfirm ? 'Kunden-WhatsApp: erwünscht' : 'Kunden-WhatsApp: nein',
    ].join('\n');

    await enqueueNotify(notifyMsg);

    if (booking.whatsappConfirm && booking.phone) {
      const clientMsg = [
        `Hi ${booking.name || ''}, danke für deine Anfrage!`,
        'Wir haben alles erhalten und melden uns so schnell wie möglich.',
      ].join(' ');
      await enqueueNotify(`TO:${booking.phone} ${clientMsg}`);
    }

    console.log('New booking request', booking);

    return NextResponse.json({ ok: true, taskId: task.id });
  } catch (err) {
    return NextResponse.json({ error: 'invalid payload' }, { status: 400 });
  }
}
