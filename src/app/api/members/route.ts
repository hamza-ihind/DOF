import { NextResponse } from 'next/server';
import { getMembers } from '@/lib/db';

export async function GET() {
  try {
    const members = await getMembers();
    return NextResponse.json({ success: true, members });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch members' },
      { status: 500 }
    );
  }
}
