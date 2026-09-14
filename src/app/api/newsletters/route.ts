import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getNewsletters, addNewsletter, updateNewsletter, deleteNewsletter } from '@/lib/db';
import { isValidAdminToken, ADMIN_COOKIE_NAME } from '@/lib/adminConfig';

function isAuth() {
  const token = cookies().get(ADMIN_COOKIE_NAME)?.value;
  return isValidAdminToken(token);
}

export async function GET() {
  try {
    const newsletters = await getNewsletters();
    return NextResponse.json({ success: true, newsletters });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch newsletters' },
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
    if (!body.title || !body.linkUrl) {
      return NextResponse.json(
        { success: false, error: 'Title and Link URL are required' },
        { status: 400 }
      );
    }

    const newsletter = await addNewsletter({
      title: body.title,
      description: body.description || '',
      imageUrl: body.imageUrl || '/images/school_renovation.jpg',
      linkUrl: body.linkUrl,
      category: body.category || 'Update',
      date: body.date || new Date().toISOString().split('T')[0]
    });

    return NextResponse.json({ success: true, newsletter });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: 'Failed to add newsletter' },
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
      return NextResponse.json({ success: false, error: 'Newsletter ID is required' }, { status: 400 });
    }

    const updated = await updateNewsletter(Number(id), data);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Newsletter not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, newsletter: updated });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: 'Failed to update newsletter' },
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
      return NextResponse.json({ success: false, error: 'Newsletter ID is required' }, { status: 400 });
    }

    const deleted = await deleteNewsletter(Number(id));
    return NextResponse.json({ success: deleted });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete newsletter' },
      { status: 500 }
    );
  }
}
