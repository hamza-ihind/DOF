import { neon } from '@neondatabase/serverless';
import { INITIAL_MEMBERS, INITIAL_EVENTS, Member, EventItem } from './seedData';

const isNeonConfigured = () => {
  const url = process.env.DATABASE_URL;
  return Boolean(url && !url.includes('placeholder') && url.startsWith('postgres'));
};

export async function getMembers(): Promise<Member[]> {
  if (!isNeonConfigured()) {
    return INITIAL_MEMBERS;
  }

  try {
    const sql = neon(process.env.DATABASE_URL!);
    const rows = await sql`
      SELECT id, name, role, photo_url as "photoUrl", bio, location
      FROM members
      ORDER BY id ASC
    `;
    
    if (!rows || rows.length === 0) {
      return INITIAL_MEMBERS;
    }
    
    return rows as Member[];
  } catch (error) {
    console.warn('Neon DB query failed, falling back to mock seed data:', error);
    return INITIAL_MEMBERS;
  }
}

export async function getEvents(): Promise<EventItem[]> {
  if (!isNeonConfigured()) {
    return INITIAL_EVENTS;
  }

  try {
    const sql = neon(process.env.DATABASE_URL!);
    const eventRows = await sql`
      SELECT id, slug, title, category, date, location, image_url as "imageUrl", excerpt, content, impact_summary as "impactSummary"
      FROM events
      ORDER BY date DESC
    `;

    if (!eventRows || eventRows.length === 0) {
      return INITIAL_EVENTS;
    }

    const eventsWithMembers = await Promise.all(
      eventRows.map(async (event) => {
        const memberRows = await sql`
          SELECT member_id
          FROM event_members
          WHERE event_id = ${event.id}
        `;
        return {
          ...event,
          date: new Date(event.date).toISOString().split('T')[0],
          contributingMemberIds: memberRows.map((r: any) => r.member_id)
        };
      })
    );

    return eventsWithMembers as EventItem[];
  } catch (error) {
    console.warn('Neon DB event query failed, falling back to mock seed data:', error);
    return INITIAL_EVENTS;
  }
}

export async function getEventBySlug(slug: string): Promise<EventItem | null> {
  const allEvents = await getEvents();
  return allEvents.find((e) => e.slug === slug) || null;
}

export async function saveContactMessage(name: string, email: string, subject: string, message: string) {
  if (isNeonConfigured()) {
    try {
      const sql = neon(process.env.DATABASE_URL!);
      await sql`
        INSERT INTO contact_messages (name, email, subject, message)
        VALUES (${name}, ${email}, ${subject}, ${message})
      `;
    } catch (err) {
      console.error('Failed to insert contact message into Neon DB:', err);
    }
  }
}
