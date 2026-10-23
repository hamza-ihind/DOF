import { requireAdminPage } from '@/lib/auth';
import { getMembers } from '@/lib/db';
import EventEditor from '@/components/EventEditor';
export default async function NewEvent() { await requireAdminPage(); return <EventEditor members={await getMembers()} />; }