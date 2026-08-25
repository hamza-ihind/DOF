import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getTransactions, addTransaction, updateTransaction, deleteTransaction } from '@/lib/db';
import { isValidAdminToken, ADMIN_COOKIE_NAME } from '@/lib/adminConfig';

function isAuth() {
  const token = cookies().get(ADMIN_COOKIE_NAME)?.value;
  return isValidAdminToken(token);
}

export async function GET() {
  try {
    const transactions = await getTransactions();
    return NextResponse.json({ success: true, transactions });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch transactions' },
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
    if (!body.memberName || body.amount === undefined || body.amount === null || isNaN(Number(body.amount))) {
      return NextResponse.json(
        { success: false, error: 'Donator member and a valid amount are required' },
        { status: 400 }
      );
    }

    const tx = await addTransaction({
      memberId: body.memberId ? Number(body.memberId) : null,
      memberName: String(body.memberName).trim(),
      amount: Number(body.amount),
      date: body.date || new Date().toISOString().split('T')[0],
      notes: body.notes || ''
    });

    return NextResponse.json({ success: true, transaction: tx });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: 'Failed to add transaction' },
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
      return NextResponse.json({ success: false, error: 'Transaction ID is required' }, { status: 400 });
    }

    const updated = await updateTransaction(Number(id), {
      memberId: data.memberId !== undefined ? (data.memberId ? Number(data.memberId) : null) : undefined,
      memberName: data.memberName ? String(data.memberName).trim() : undefined,
      amount: data.amount !== undefined ? Number(data.amount) : undefined,
      date: data.date,
      notes: data.notes
    });

    if (!updated) {
      return NextResponse.json({ success: false, error: 'Transaction not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, transaction: updated });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: 'Failed to update transaction' },
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
      return NextResponse.json({ success: false, error: 'Transaction ID is required' }, { status: 400 });
    }

    const deleted = await deleteTransaction(Number(id));
    return NextResponse.json({ success: deleted });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete transaction' },
      { status: 500 }
    );
  }
}
