import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth';
import { getMembers, addMember, updateMember, deleteMember } from '@/lib/db';
import { memberInput } from '@/lib/contentValidation';
import { bodyJson, failure, idField, sameOrigin, HttpError } from '@/lib/security';
export const dynamic = 'force-dynamic';
function refresh() { revalidatePath('/'); revalidatePath('/members', 'layout'); }
export async function GET() {
  try { return NextResponse.json({ success: true, members: await getMembers() }); } catch (error) { return failure(error); }
}
export async function POST(request: Request) {
  try {
    await requireAdmin();
    const input = memberInput(await bodyJson(request));
    
    const member = await addMember(input); refresh();
    return NextResponse.json({ success: true, member }, { status: 201 });
  } catch (error) { return failure(error); }
}
export async function PUT(request: Request) {
  try {
    await requireAdmin(); const body = await bodyJson(request); const id = idField(body.id); const input = memberInput(body);
    
    const member = await updateMember(id, input); refresh();
    return NextResponse.json({ success: !!member, member }, { status: member ? 200 : 404 });
  } catch (error) { return failure(error); }
}
export async function DELETE(request: Request) {
  try { await requireAdmin(); sameOrigin(request); const success = await deleteMember(idField(new URL(request.url).searchParams.get('id'))); refresh(); return NextResponse.json({ success }); }
  catch (error) { return failure(error); }
}