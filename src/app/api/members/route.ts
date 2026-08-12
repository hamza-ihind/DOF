import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getMembers, addMember, updateMember, deleteMember } from '@/lib/db';
import { isValidAdminToken, ADMIN_COOKIE_NAME } from '@/lib/adminConfig';

function isAuth() {
  const token = cookies().get(ADMIN_COOKIE_NAME)?.value;
  return isValidAdminToken(token);
}

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

export async function POST(request: Request) {
  if (!isAuth()) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (!body.name || !body.role) {
      return NextResponse.json(
        { success: false, error: 'Name and Role are required' },
        { status: 400 }
      );
    }

    const member = await addMember({
      name: body.name,
      role: body.role,
      photoUrl: body.photoUrl || '/images/member_1.jpg',
      bio: body.bio || '',
      location: body.location || 'Biougra, Morocco',
      tier: Number(body.tier) as 1 | 2 | 3 || 3
    });

    return NextResponse.json({ success: true, member });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: 'Failed to add member' },
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
      return NextResponse.json({ success: false, error: 'Member ID is required' }, { status: 400 });
    }

    const updated = await updateMember(Number(id), data);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Member not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, member: updated });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: 'Failed to update member' },
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
      return NextResponse.json({ success: false, error: 'Member ID is required' }, { status: 400 });
    }

    const deleted = await deleteMember(Number(id));
    return NextResponse.json({ success: deleted });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete member' },
      { status: 500 }
    );
  }
}
