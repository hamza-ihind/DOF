import Link from 'next/link';
import { requireAdminPage } from '@/lib/auth';
import { getEvents } from '@/lib/db';
export default async function EventsAdmin() {
  await requireAdminPage(); const events = await getEvents();
  return <main className="workspace"><Link href="/admin">Back to dashboard</Link><div className="section-heading"><h1>Event reports</h1><Link className="primary-button" href="/admin/events/new">Create event</Link></div><div className="panel">{events.length ? events.map(e => <div className="list-row" key={e.id}><div><strong>{e.title}</strong><p>{e.date} / {e.location}</p></div><Link href={`/admin/events/${e.id}/edit`}>Edit report</Link></div>) : <p>No event reports yet. Publish your first story to share it with the community.</p>}</div></main>;
}