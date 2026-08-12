import { neon } from '@neondatabase/serverless';
import { INITIAL_MEMBERS, INITIAL_EVENTS, Member, EventItem } from './seedData';

// Fallback in-memory state when Neon DB is not active
let fallbackMembers: Member[] = [...INITIAL_MEMBERS];
let fallbackEvents: EventItem[] = [...INITIAL_EVENTS];

const isNeonConfigured = () => {
  const url = process.env.DATABASE_URL;
  return Boolean(url && !url.includes('placeholder') && url.startsWith('postgres'));
};

export async function getMembers(): Promise<Member[]> {
  if (!isNeonConfigured()) {
    return fallbackMembers;
  }

  try {
    const sql = neon(process.env.DATABASE_URL!);
    const rows = await sql`
      SELECT id, name, role, photo_url as "photoUrl", bio, location, COALESCE(tier, 3) as tier
      FROM members
      ORDER BY tier ASC, id ASC
    `;
    
    if (!rows || rows.length === 0) {
      return fallbackMembers;
    }
    
    return rows as Member[];
  } catch (error) {
    console.warn('Neon DB query failed, falling back to mock seed data:', error);
    return fallbackMembers;
  }
}

export async function addMember(member: Omit<Member, 'id'>): Promise<Member> {
  if (!isNeonConfigured()) {
    const newId = fallbackMembers.length > 0 ? Math.max(...fallbackMembers.map(m => m.id)) + 1 : 1;
    const newMember: Member = { ...member, id: newId };
    fallbackMembers.push(newMember);
    return newMember;
  }

  try {
    const sql = neon(process.env.DATABASE_URL!);
    const rows = await sql`
      INSERT INTO members (name, role, photo_url, bio, location, tier)
      VALUES (${member.name}, ${member.role}, ${member.photoUrl}, ${member.bio || ''}, ${member.location || 'Biougra, Morocco'}, ${member.tier || 3})
      RETURNING id, name, role, photo_url as "photoUrl", bio, location, tier
    `;
    return rows[0] as Member;
  } catch (error) {
    console.error('Failed to add member to Neon DB, adding to fallback state:', error);
    const newId = fallbackMembers.length > 0 ? Math.max(...fallbackMembers.map(m => m.id)) + 1 : 1;
    const newMember: Member = { ...member, id: newId };
    fallbackMembers.push(newMember);
    return newMember;
  }
}

export async function updateMember(id: number, memberData: Partial<Omit<Member, 'id'>>): Promise<Member | null> {
  if (!isNeonConfigured()) {
    const index = fallbackMembers.findIndex(m => m.id === id);
    if (index === -1) return null;
    fallbackMembers[index] = { ...fallbackMembers[index], ...memberData };
    return fallbackMembers[index];
  }

  try {
    const sql = neon(process.env.DATABASE_URL!);
    const current = (await sql`SELECT * FROM members WHERE id = ${id}`)[0];
    if (!current) return null;

    const updated = {
      name: memberData.name ?? current.name,
      role: memberData.role ?? current.role,
      photoUrl: memberData.photoUrl ?? current.photo_url,
      bio: memberData.bio ?? current.bio,
      location: memberData.location ?? current.location,
      tier: memberData.tier ?? current.tier ?? 3
    };

    const rows = await sql`
      UPDATE members
      SET name = ${updated.name},
          role = ${updated.role},
          photo_url = ${updated.photoUrl},
          bio = ${updated.bio},
          location = ${updated.location},
          tier = ${updated.tier}
      WHERE id = ${id}
      RETURNING id, name, role, photo_url as "photoUrl", bio, location, tier
    `;
    return rows[0] as Member;
  } catch (error) {
    console.error('Failed to update member in Neon DB, updating fallback state:', error);
    const index = fallbackMembers.findIndex(m => m.id === id);
    if (index === -1) return null;
    fallbackMembers[index] = { ...fallbackMembers[index], ...memberData };
    return fallbackMembers[index];
  }
}

export async function deleteMember(id: number): Promise<boolean> {
  if (!isNeonConfigured()) {
    const initialLen = fallbackMembers.length;
    fallbackMembers = fallbackMembers.filter(m => m.id !== id);
    return fallbackMembers.length < initialLen;
  }

  try {
    const sql = neon(process.env.DATABASE_URL!);
    await sql`DELETE FROM members WHERE id = ${id}`;
    fallbackMembers = fallbackMembers.filter(m => m.id !== id);
    return true;
  } catch (error) {
    console.error('Failed to delete member from Neon DB:', error);
    const initialLen = fallbackMembers.length;
    fallbackMembers = fallbackMembers.filter(m => m.id !== id);
    return fallbackMembers.length < initialLen;
  }
}

export async function getEvents(): Promise<EventItem[]> {
  if (!isNeonConfigured()) {
    return fallbackEvents;
  }

  try {
    const sql = neon(process.env.DATABASE_URL!);
    const eventRows = await sql`
      SELECT id, slug, title, category, date, location, image_url as "imageUrl", excerpt, content, impact_summary as "impactSummary", timeline_days as "timelineDays"
      FROM events
      ORDER BY date DESC
    `;

    if (!eventRows || eventRows.length === 0) {
      return fallbackEvents;
    }

    const eventsWithMembers = await Promise.all(
      eventRows.map(async (event: any) => {
        const memberRows = await sql`
          SELECT member_id
          FROM event_members
          WHERE event_id = ${event.id}
        `;
        let parsedTimeline = [];
        if (event.timelineDays) {
          parsedTimeline = typeof event.timelineDays === 'string'
            ? JSON.parse(event.timelineDays)
            : event.timelineDays;
        }

        return {
          ...event,
          date: new Date(event.date).toISOString().split('T')[0],
          timelineDays: parsedTimeline,
          contributingMemberIds: memberRows.map((r: any) => r.member_id)
        };
      })
    );

    return eventsWithMembers as EventItem[];
  } catch (error) {
    console.warn('Neon DB event query failed, falling back to mock seed data:', error);
    return fallbackEvents;
  }
}

export async function addEvent(event: Omit<EventItem, 'id'>): Promise<EventItem> {
  if (!isNeonConfigured()) {
    const newId = fallbackEvents.length > 0 ? Math.max(...fallbackEvents.map(e => e.id)) + 1 : 1;
    const newEvent: EventItem = { ...event, id: newId };
    fallbackEvents.unshift(newEvent);
    return newEvent;
  }

  try {
    const sql = neon(process.env.DATABASE_URL!);
    const rows = await sql`
      INSERT INTO events (slug, title, category, date, location, image_url, excerpt, content, impact_summary, timeline_days)
      VALUES (
        ${event.slug},
        ${event.title},
        ${event.category},
        ${event.date},
        ${event.location},
        ${event.imageUrl},
        ${event.excerpt},
        ${event.content},
        ${event.impactSummary || ''},
        ${JSON.stringify(event.timelineDays || [])}
      )
      RETURNING id, slug, title, category, date, location, image_url as "imageUrl", excerpt, content, impact_summary as "impactSummary", timeline_days as "timelineDays"
    `;

    const created: any = rows[0];
    if (event.contributingMemberIds && event.contributingMemberIds.length > 0) {
      for (const mId of event.contributingMemberIds) {
        await sql`INSERT INTO event_members (event_id, member_id) VALUES (${created.id}, ${mId}) ON CONFLICT DO NOTHING`;
      }
    }

    const result: EventItem = {
      id: created.id,
      slug: created.slug,
      title: created.title,
      category: created.category,
      date: new Date(created.date).toISOString().split('T')[0],
      location: created.location,
      imageUrl: created.imageUrl,
      excerpt: created.excerpt,
      content: created.content,
      impactSummary: created.impactSummary,
      timelineDays: typeof created.timelineDays === 'string' ? JSON.parse(created.timelineDays) : (created.timelineDays || []),
      contributingMemberIds: event.contributingMemberIds || []
    };
    return result;
  } catch (error) {
    console.error('Failed to add event to Neon DB, fallback:', error);
    const newId = fallbackEvents.length > 0 ? Math.max(...fallbackEvents.map(e => e.id)) + 1 : 1;
    const newEvent: EventItem = { ...event, id: newId };
    fallbackEvents.unshift(newEvent);
    return newEvent;
  }
}

export async function updateEvent(id: number, eventData: Partial<Omit<EventItem, 'id'>>): Promise<EventItem | null> {
  if (!isNeonConfigured()) {
    const index = fallbackEvents.findIndex(e => e.id === id);
    if (index === -1) return null;
    fallbackEvents[index] = { ...fallbackEvents[index], ...eventData };
    return fallbackEvents[index];
  }

  try {
    const sql = neon(process.env.DATABASE_URL!);
    const current = (await sql`SELECT * FROM events WHERE id = ${id}`)[0];
    if (!current) return null;

    const updated = {
      slug: eventData.slug ?? current.slug,
      title: eventData.title ?? current.title,
      category: eventData.category ?? current.category,
      date: eventData.date ?? current.date,
      location: eventData.location ?? current.location,
      imageUrl: eventData.imageUrl ?? current.image_url,
      excerpt: eventData.excerpt ?? current.excerpt,
      content: eventData.content ?? current.content,
      impactSummary: eventData.impactSummary ?? current.impact_summary,
      timelineDays: eventData.timelineDays !== undefined ? eventData.timelineDays : (typeof current.timeline_days === 'string' ? JSON.parse(current.timeline_days) : (current.timeline_days || []))
    };

    const rows = await sql`
      UPDATE events
      SET slug = ${updated.slug},
          title = ${updated.title},
          category = ${updated.category},
          date = ${updated.date},
          location = ${updated.location},
          image_url = ${updated.imageUrl},
          excerpt = ${updated.excerpt},
          content = ${updated.content},
          impact_summary = ${updated.impactSummary},
          timeline_days = ${JSON.stringify(updated.timelineDays)}
      WHERE id = ${id}
      RETURNING id, slug, title, category, date, location, image_url as "imageUrl", excerpt, content, impact_summary as "impactSummary", timeline_days as "timelineDays"
    `;

    if (eventData.contributingMemberIds) {
      await sql`DELETE FROM event_members WHERE event_id = ${id}`;
      for (const mId of eventData.contributingMemberIds) {
        await sql`INSERT INTO event_members (event_id, member_id) VALUES (${id}, ${mId}) ON CONFLICT DO NOTHING`;
      }
    }

    const res: any = rows[0];
    return {
      id: res.id,
      slug: res.slug,
      title: res.title,
      category: res.category,
      date: new Date(res.date).toISOString().split('T')[0],
      location: res.location,
      imageUrl: res.imageUrl,
      excerpt: res.excerpt,
      content: res.content,
      impactSummary: res.impactSummary,
      timelineDays: typeof res.timelineDays === 'string' ? JSON.parse(res.timelineDays) : (res.timelineDays || []),
      contributingMemberIds: eventData.contributingMemberIds || []
    };
  } catch (error) {
    console.error('Failed to update event in Neon DB, fallback:', error);
    const index = fallbackEvents.findIndex(e => e.id === id);
    if (index === -1) return null;
    fallbackEvents[index] = { ...fallbackEvents[index], ...eventData };
    return fallbackEvents[index];
  }
}

export async function deleteEvent(id: number): Promise<boolean> {
  if (!isNeonConfigured()) {
    const initialLen = fallbackEvents.length;
    fallbackEvents = fallbackEvents.filter(e => e.id !== id);
    return fallbackEvents.length < initialLen;
  }

  try {
    const sql = neon(process.env.DATABASE_URL!);
    await sql`DELETE FROM events WHERE id = ${id}`;
    fallbackEvents = fallbackEvents.filter(e => e.id !== id);
    return true;
  } catch (error) {
    console.error('Failed to delete event from Neon DB:', error);
    const initialLen = fallbackEvents.length;
    fallbackEvents = fallbackEvents.filter(e => e.id !== id);
    return fallbackEvents.length < initialLen;
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


