import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const DATA_FILE = join(process.cwd(), 'data', 'pinjaman.json');

function ensureDataFile() {
  const dir = join(process.cwd(), 'data');
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  if (!existsSync(DATA_FILE)) writeFileSync(DATA_FILE, '[]');
}

export async function GET() {
  try {
    ensureDataFile();
    const data = JSON.parse(readFileSync(DATA_FILE, 'utf-8'));
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: 'Gagal membaca data' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    ensureDataFile();
    const body = await request.json();
    const data = JSON.parse(readFileSync(DATA_FILE, 'utf-8'));
    data.push(body);
    writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    return NextResponse.json({ success: true, data: body });
  } catch (err) {
    return NextResponse.json({ error: 'Gagal menyimpan data' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    const data = JSON.parse(readFileSync(DATA_FILE, 'utf-8'));
    const filtered = data.filter((item: any) => item.id !== id);
    writeFileSync(DATA_FILE, JSON.stringify(filtered, null, 2));
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Gagal menghapus data' }, { status: 500 });
  }
}
