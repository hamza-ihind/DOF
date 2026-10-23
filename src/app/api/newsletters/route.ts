import { NextResponse } from 'next/server';
import { requireAdmin, getSession } from '@/lib/auth';
import { bodyJson, database, failure, field, idField, sameOrigin, HttpError } from '@/lib/security';
import { revalidatePath } from 'next/cache';
export const dynamic = 'force-dynamic';
export async function GET(request: Request) {
  try {
    const admin = new URL(request.url).searchParams.get('admin') === '1';
    if (admin) await requireAdmin();
    const sql = database();
    const newsletters = admin ? await sql`SELECT * FROM newsletters ORDER BY created_at DESC` : await sql`SELECT id, title, summary, content, published_at FROM newsletters WHERE published = TRUE ORDER BY published_at DESC`;
    return NextResponse.json({ success: true, newsletters });
  } catch (error) { return failure(error); }
}
async function save(request: Request, editing: boolean) {
  try {
    await requireAdmin(); const body = await bodyJson(request);
    const title = field(body.title, 'title', 200), summary = field(body.summary, 'summary', 1000), content = field(body.content, 'newsletter', 30000);
    if (typeof body.published !== 'boolean') throw new HttpError(400, 'Invalid publication status');
    const sql = database(), published = body.published;
    const rows = editing ? await sql`UPDATE newsletters SET title = ${title}, summary = ${summary}, content = ${content}, published = ${published}, published_at = CASE WHEN ${published} THEN COALESCE(published_at, NOW()) ELSE published_at END WHERE id = ${idField(body.id)} RETURNING id` : await sql`INSERT INTO newsletters (title, summary, content, published, published_at) VALUES (${title}, ${summary}, ${content}, ${published}, CASE WHEN ${published} THEN NOW() ELSE NULL END) RETURNING id`;
    if (!rows.length) throw new HttpError(404, 'Newsletter not found');
    revalidatePath('/newsletters');
    return NextResponse.json({ success: true, id: rows[0].id });
  } catch (error) { return failure(error); }
}
export async function POST(request: Request) { return save(request, false); }
export async function PUT(request: Request) { return save(request, true); }
export async function DELETE(request: Request) {
  try { await requireAdmin(); sameOrigin(request); const sql = database(); await sql`DELETE FROM newsletters WHERE id = ${idField(new URL(request.url).searchParams.get('id'))}`; revalidatePath('/newsletters'); return NextResponse.json({ success: true }); }
  catch (error) { return failure(error); }
}