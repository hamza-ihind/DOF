import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { bodyJson, database, failure, idField, HttpError } from '@/lib/security';
export async function GET() {
  try {
    await requireAdmin();
    const sql = database();
    const accounts = await sql`SELECT id, name, email, status, created_at AS "createdAt" FROM users ORDER BY created_at DESC`;
    return NextResponse.json({ success: true, accounts });
  } catch (error) { return failure(error); }
}
export async function PATCH(request: Request) {
  try {
    await requireAdmin();
    const body = await bodyJson(request);
    const id = idField(body.id);
    if (!['active', 'rejected', 'pending'].includes(body.status)) throw new HttpError(400, 'Invalid account status');
    const sql = database();
    const rows = await sql`UPDATE users SET status = ${body.status} WHERE id = ${id} RETURNING id`;
    if (!rows.length) throw new HttpError(404, 'Account not found');
    if (body.status !== 'active') await sql`DELETE FROM sessions WHERE user_id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (error) { return failure(error); }
}