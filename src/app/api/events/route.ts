import { NextResponse } from 'next/server';
import { getEvents } from '@/lib/db';

export async function GET() {
  try {
    const events = await getEvents();
    return NextResponse.json({ success: true, events });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}
