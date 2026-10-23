import { requireAdminPage } from '@/lib/auth';
import { getEvents, getMembers } from '@/lib/db';
import { notFound } from 'next/navigation';
import EventEditor from '@/components/EventEditor';
export default async function EditEvent({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminPage(); const { id } = await params; const event = (await getEvents()).find(e => e.id === Number(id)); if (!event) notFound();
  return <EventEditor event={event} members={await getMembers()} />;
}