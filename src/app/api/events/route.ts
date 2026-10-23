import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth';
import { getEvents, addEvent, updateEvent, deleteEvent } from '@/lib/db';
import { eventInput } from '@/lib/contentValidation';
import { bodyJson, failure, idField, sameOrigin, HttpError } from '@/lib/security';
export const dynamic = 'force-dynamic';
function refresh() { revalidatePath('/'); revalidatePath('/events', 'layout'); }
export async function GET() {
  try { return NextResponse.json({ success: true, events: await getEvents() }); } catch (error) { return failure(error); }
}
export async function POST(request: Request) {
  try {
    await requireAdmin();
    const input = eventInput(await bodyJson(request));
    if ((await getEvents()).some(event => event.slug === input.slug)) throw new HttpError(409, 'This event URL already exists. Choose another slug.');
    const event = await addEvent(input); refresh();
    return NextResponse.json({ success: true, event }, { status: 201 });
  } catch (error) { return failure(error); }
}
export async function PUT(request: Request) {
  try {
    await requireAdmin(); const body = await bodyJson(request); const id = idField(body.id); const input = eventInput(body);
    if ((await getEvents()).some(event => event.slug === input.slug && event.id !== id)) throw new HttpError(409, 'This event URL already exists.');
    const event = await updateEvent(id, input); refresh();
    return NextResponse.json({ success: !!event, event }, { status: event ? 200 : 404 });
  } catch (error) { return failure(error); }
}
export async function DELETE(request: Request) {
  try { await requireAdmin(); sameOrigin(request); const success = await deleteEvent(idField(new URL(request.url).searchParams.get('id'))); refresh(); return NextResponse.json({ success }); }
  catch (error) { return failure(error); }
}