import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getEvents, addEvent, updateEvent, deleteEvent } from '@/lib/db';
import { isValidAdminToken, ADMIN_COOKIE_NAME } from '@/lib/adminConfig';

function isAuth() {
  const token = cookies().get(ADMIN_COOKIE_NAME)?.value;
  return isValidAdminToken(token);
}

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

export async function POST(request: Request) {
  if (!isAuth()) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (!body.title || !body.category || !body.date) {
      return NextResponse.json(
        { success: false, error: 'Title, Category, and Date are required' },
        { status: 400 }
      );
    }

    const slug = body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const event = await addEvent({
      slug,
      title: body.title,
      category: body.category,
      date: body.date,
      location: body.location || 'Biougra Region',
      imageUrl: body.imageUrl || '/images/school_renovation.jpg',
      excerpt: body.excerpt || '',
      content: body.content || '',
      impactSummary: body.impactSummary || '',
      contributingMemberIds: body.contributingMemberIds || [],
      timelineDays: body.timelineDays || []
    });

    return NextResponse.json({ success: true, event });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: 'Failed to add event' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  if (!isAuth()) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, ...data } = body;
    if (!id) {
      return NextResponse.json({ success: false, error: 'Event ID is required' }, { status: 400 });
    }

    const updated = await updateEvent(Number(id), data);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, event: updated });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: 'Failed to update event' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  if (!isAuth()) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Event ID is required' }, { status: 400 });
    }

    const deleted = await deleteEvent(Number(id));
    return NextResponse.json({ success: deleted });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete event' },
      { status: 500 }
    );
  }
}
