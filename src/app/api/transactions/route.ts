import { NextResponse } from 'next/server';
import { getSession, requireAdmin, requireMember } from '@/lib/auth';
import { getTransactions, addTransaction, updateTransaction, deleteTransaction } from '@/lib/db';
import { bodyJson, database, failure, field, amountField, dateField, idField, sameOrigin } from '@/lib/security';
export async function GET() {
  try {
    const session = await getSession();
    if (session?.role === 'admin') return NextResponse.json({ success: true, transactions: await getTransactions() });
    const member = await requireMember();
    const sql = database();
    const rows = await sql`SELECT id, amount, date, notes, created_at AS "createdAt" FROM transactions WHERE user_id = ${member.userId} ORDER BY created_at DESC`;
    return NextResponse.json({ success: true, transactions: rows.map(row => ({ ...row, amount: Number(row.amount), date: new Date(row.date).toISOString().slice(0, 10) })) });
  } catch (error) { return failure(error); }
}
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (session?.role !== 'admin') await requireMember();
    const body = await bodyJson(request);
    const amount = amountField(body.amount);
    if (session?.role === 'admin') {
      const transaction = await addTransaction({ memberId: body.memberId ? idField(body.memberId) : null, memberName: field(body.memberName, 'member name'), amount, date: dateField(body.date || new Date().toISOString().slice(0, 10)), notes: field(body.notes, 'description', 2000, false) });
      return NextResponse.json({ success: true, transaction }, { status: 201 });
    }
    // Ownership, name and date always come from the server, never the request.
    const notes = field(body.description, 'description', 2000);
    const sql = database();
    const rows = await sql`INSERT INTO transactions (user_id, member_name, amount, date, notes) SELECT id, name, ${amount}, CURRENT_DATE, ${notes} FROM users WHERE id = ${session!.userId} AND status = 'active' RETURNING id, amount, date, notes`;
    if (!rows.length) return NextResponse.json({ error: 'Approval required' }, { status: 403 });
    return NextResponse.json({ success: true, transaction: rows[0] }, { status: 201 });
  } catch (error) { return failure(error); }
}
export async function PUT(request: Request) {
  try {
    await requireAdmin();
    const body = await bodyJson(request);
    const transaction = await updateTransaction(idField(body.id), { memberId: body.memberId ? idField(body.memberId) : null, memberName: field(body.memberName, 'member name'), amount: amountField(body.amount), date: dateField(body.date), notes: field(body.notes, 'description', 2000, false) });
    return NextResponse.json({ success: !!transaction, transaction }, { status: transaction ? 200 : 404 });
  } catch (error) { return failure(error); }
}
export async function DELETE(request: Request) {
  try { await requireAdmin(); sameOrigin(request); return NextResponse.json({ success: await deleteTransaction(idField(new URL(request.url).searchParams.get('id'))) }); }
  catch (error) { return failure(error); }
}