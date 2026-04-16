import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const EQUIPMENT_PATH = path.join(process.cwd(), 'src', 'data', 'equipment.json');

type BatteryStatus = 'full' | 'charging' | 'low';

interface EquipmentItem {
  id: string;
  name: string;
  type: string;
  batteries?: number;
  batteryStatus?: BatteryStatus;
}

interface EquipmentData {
  cameras: EquipmentItem[];
  lenses: EquipmentItem[];
  drones: EquipmentItem[];
  audio: EquipmentItem[];
  stabilization: EquipmentItem[];
  lighting: EquipmentItem[];
}

async function readEquipment(): Promise<EquipmentData> {
  const raw = await fs.readFile(EQUIPMENT_PATH, 'utf8');
  return JSON.parse(raw);
}

async function writeEquipment(data: EquipmentData): Promise<void> {
  await fs.writeFile(EQUIPMENT_PATH, JSON.stringify(data, null, 2));
}

// GET: Alle Equipment-Daten zurückgeben
export async function GET() {
  try {
    const data = await readEquipment();
    return NextResponse.json(data);
  } catch (err) {
    console.error('Failed to read equipment:', err);
    return NextResponse.json({ error: 'Failed to read equipment' }, { status: 500 });
  }
}

// PUT: Equipment aktualisieren (batteryStatus, etc.)
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, category, updates } = body;
    
    if (!id || !category || !updates) {
      return NextResponse.json({ error: 'id, category, and updates required' }, { status: 400 });
    }

    const data = await readEquipment();
    const categoryKey = category as keyof EquipmentData;
    
    if (!data[categoryKey]) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
    }

    const itemIndex = data[categoryKey].findIndex((item: EquipmentItem) => item.id === id);
    if (itemIndex === -1) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    // Merge updates
    data[categoryKey][itemIndex] = { ...data[categoryKey][itemIndex], ...updates };
    await writeEquipment(data);

    return NextResponse.json({ ok: true, item: data[categoryKey][itemIndex] });
  } catch (err) {
    console.error('Failed to update equipment:', err);
    return NextResponse.json({ error: 'Failed to update equipment' }, { status: 500 });
  }
}

// POST: Neues Equipment hinzufügen
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { category, item } = body;
    
    if (!category || !item || !item.id || !item.name) {
      return NextResponse.json({ error: 'category, item.id, and item.name required' }, { status: 400 });
    }

    const data = await readEquipment();
    const categoryKey = category as keyof EquipmentData;
    
    if (!data[categoryKey]) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
    }

    // Check if ID already exists
    const exists = data[categoryKey].some((e: EquipmentItem) => e.id === item.id);
    if (exists) {
      return NextResponse.json({ error: 'Item with this ID already exists' }, { status: 409 });
    }

    data[categoryKey].push(item);
    await writeEquipment(data);

    return NextResponse.json({ ok: true, item });
  } catch (err) {
    console.error('Failed to add equipment:', err);
    return NextResponse.json({ error: 'Failed to add equipment' }, { status: 500 });
  }
}

// DELETE: Equipment löschen (query param ?id=xxx&category=yyy)
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const category = searchParams.get('category');

    if (!id || !category) {
      return NextResponse.json({ error: 'id and category query params required' }, { status: 400 });
    }

    const data = await readEquipment();
    const categoryKey = category as keyof EquipmentData;
    
    if (!data[categoryKey]) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
    }

    const itemIndex = data[categoryKey].findIndex((item: EquipmentItem) => item.id === id);
    if (itemIndex === -1) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    const [removed] = data[categoryKey].splice(itemIndex, 1);
    await writeEquipment(data);

    return NextResponse.json({ ok: true, removed });
  } catch (err) {
    console.error('Failed to delete equipment:', err);
    return NextResponse.json({ error: 'Failed to delete equipment' }, { status: 500 });
  }
}
