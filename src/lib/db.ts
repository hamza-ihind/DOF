import { neon } from '@neondatabase/serverless';
<<<<<<< HEAD
import type { Member, EventItem, Transaction } from './seedData';
=======
import { INITIAL_MEMBERS, INITIAL_EVENTS, INITIAL_TRANSACTIONS, INITIAL_NEWSLETTERS, Member, EventItem, Transaction, NewsletterItem } from './seedData';

// Fallback in-memory state ONLY when no database is configured
let fallbackMembers: Member[] = [...INITIAL_MEMBERS];
let fallbackEvents: EventItem[] = [...INITIAL_EVENTS];
let fallbackTransactions: Transaction[] = [...INITIAL_TRANSACTIONS];
let fallbackNewsletters: NewsletterItem[] = [...INITIAL_NEWSLETTERS];
>>>>>>> 368d0179f0b6ba748a04b6f9e43715c842dbb7ea

const isNeonConfigured = () => {
  const url = process.env.DATABASE_URL;
  return Boolean(
    url &&
    !url.includes('placeholder') &&
    !url.includes('user:password') &&
    !url.includes('ep-example-123456') &&
    url.startsWith('postgres')
  );
};

export async function getMembers(): Promise<Member[]> {
  if (!isNeonConfigured()) {
    return [];
  }

  try {
    const sql = neon(process.env.DATABASE_URL!);
    const rows = await sql`
      SELECT id, name, role, photo_url as "photoUrl", bio, location,
             COALESCE(role_en, role) as "roleEn",
             COALESCE(role_fr, role) as "roleFr",
             COALESCE(bio_en, bio) as "bioEn",
             COALESCE(bio_fr, bio) as "bioFr"
      FROM members
      ORDER BY id ASC
    `;
    
    return (rows || []) as Member[];
  } catch (error) {
    console.error('Neon DB getMembers failed:', error);
    return [];
  }
}

export async function addMember(member: Omit<Member, 'id'>): Promise<Member> {
  if (!isNeonConfigured()) throw new Error('Database is not configured');

  try {
    const sql = neon(process.env.DATABASE_URL!);
    const rows = await sql`
      INSERT INTO members (name, role, role_en, role_fr, photo_url, bio, bio_en, bio_fr, location)
      VALUES (${member.name}, ${member.role}, ${member.roleEn || member.role}, ${member.roleFr || member.role}, ${member.photoUrl}, ${member.bio || ''}, ${member.bioEn || member.bio || ''}, ${member.bioFr || member.bio || ''}, ${member.location || 'Biougra, Morocco'})
      RETURNING id, name, role, role_en as "roleEn", role_fr as "roleFr", photo_url as "photoUrl", bio, bio_en as "bioEn", bio_fr as "bioFr", location
    `;
    return rows[0] as Member;
  } catch (error) {
    console.error('Failed to add member to Neon DB:', error);
    throw error;
  }
}

export async function updateMember(id: number, memberData: Partial<Omit<Member, 'id'>>): Promise<Member | null> {
  if (!isNeonConfigured()) throw new Error('Database is not configured');

  try {
    const sql = neon(process.env.DATABASE_URL!);
    const current = (await sql`SELECT * FROM members WHERE id = ${id}`)[0];
    if (!current) return null;

    const updated = {
      name: memberData.name ?? current.name,
      role: memberData.role ?? current.role,
      roleEn: memberData.roleEn ?? current.role_en ?? current.role,
      roleFr: memberData.roleFr ?? current.role_fr ?? current.role,
      photoUrl: memberData.photoUrl ?? current.photo_url,
      bio: memberData.bio ?? current.bio,
      bioEn: memberData.bioEn ?? current.bio_en ?? current.bio,
      bioFr: memberData.bioFr ?? current.bio_fr ?? current.bio,
      location: memberData.location ?? current.location
    };

    const rows = await sql`
      UPDATE members
      SET name = ${updated.name},
          role = ${updated.role},
          role_en = ${updated.roleEn},
          role_fr = ${updated.roleFr},
          photo_url = ${updated.photoUrl},
          bio = ${updated.bio},
          bio_en = ${updated.bioEn},
          bio_fr = ${updated.bioFr},
          location = ${updated.location}
      WHERE id = ${id}
      RETURNING id, name, role, role_en as "roleEn", role_fr as "roleFr", photo_url as "photoUrl", bio, bio_en as "bioEn", bio_fr as "bioFr", location
    `;
    return rows[0] as Member;
  } catch (error) {
    console.error('Failed to update member in Neon DB:', error);
    throw error;
  }
}

export async function deleteMember(id: number): Promise<boolean> {
  if (!isNeonConfigured()) throw new Error('Database is not configured');

  try {
    const sql = neon(process.env.DATABASE_URL!);
    await sql`DELETE FROM members WHERE id = ${id}`;
    return true;
  } catch (error) {
    console.error('Failed to delete member from Neon DB:', error);
    throw error;
  }
}

export async function getEvents(): Promise<EventItem[]> {
  if (!isNeonConfigured()) {
    return [];
  }

  try {
    const sql = neon(process.env.DATABASE_URL!);
    const eventRows = await sql`
      SELECT id, slug, title, category, date, location, image_url as "imageUrl", excerpt, content, impact_summary as "impactSummary", timeline_days as "timelineDays"
      FROM events
      ORDER BY date DESC
    `;

    if (!eventRows || eventRows.length === 0) {
      return [];
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
    console.error('Neon DB getEvents failed:', error);
    return [];
  }
}

export async function addEvent(event: Omit<EventItem, 'id'>): Promise<EventItem> {
  if (!isNeonConfigured()) throw new Error('Database is not configured');
  const sql = neon(process.env.DATABASE_URL!);
  // The event and its contributor links commit together, including FK validation.
  const rows = await sql`
    WITH created AS (
      INSERT INTO events (slug, title, category, date, location, image_url, excerpt, content, impact_summary, timeline_days)
      VALUES (${event.slug}, ${event.title}, ${event.category}, ${event.date}, ${event.location}, ${event.imageUrl}, ${event.excerpt}, ${event.content}, ${event.impactSummary}, ${JSON.stringify(event.timelineDays)})
      RETURNING id
    ), linked AS (
      INSERT INTO event_members (event_id, member_id)
      SELECT created.id, member.value::int FROM created CROSS JOIN jsonb_array_elements_text(${JSON.stringify(event.contributingMemberIds)}::jsonb) AS member(value)
      RETURNING event_id
    ) SELECT id FROM created
  `;
  return { ...event, id: rows[0].id };
}

export async function updateEvent(id: number, data: Partial<Omit<EventItem, 'id'>>): Promise<EventItem | null> {
  if (!isNeonConfigured()) throw new Error('Database is not configured');
  const current = (await getEvents()).find(event => event.id === id);
  if (!current) return null;
  const event = { ...current, ...data };
  const sql = neon(process.env.DATABASE_URL!);
  const results = await sql.transaction([
    sql`UPDATE events SET slug = ${event.slug}, title = ${event.title}, category = ${event.category}, date = ${event.date}, location = ${event.location}, image_url = ${event.imageUrl}, excerpt = ${event.excerpt}, content = ${event.content}, impact_summary = ${event.impactSummary}, timeline_days = ${JSON.stringify(event.timelineDays)} WHERE id = ${id} RETURNING id`,
    sql`DELETE FROM event_members WHERE event_id = ${id}`,
    sql`INSERT INTO event_members (event_id, member_id) SELECT ${id}, value::int FROM jsonb_array_elements_text(${JSON.stringify(event.contributingMemberIds)}::jsonb)`
  ]);
  return results[0].length ? event : null;
}

export async function deleteEvent(id: number): Promise<boolean> {
  if (!isNeonConfigured()) throw new Error('Database is not configured');

  try {
    const sql = neon(process.env.DATABASE_URL!);
    await sql`DELETE FROM events WHERE id = ${id}`;
    return true;
  } catch (error) {
    console.error('Failed to delete event from Neon DB:', error);
    throw error;
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

export async function getTransactions(): Promise<Transaction[]> {
  if (!isNeonConfigured()) {
    return [];
  }

  try {
    const sql = neon(process.env.DATABASE_URL!);
    const rows = await sql`
      SELECT id, member_id as "memberId", member_name as "memberName", amount, date, notes, created_at as "createdAt"
      FROM transactions
      ORDER BY date DESC, id DESC
    `;

    return (rows || []).map((r: any) => ({
      ...r,
      amount: Number(r.amount),
      date: new Date(r.date).toISOString().split('T')[0]
    })) as Transaction[];
  } catch (error) {
    console.error('Neon DB getTransactions failed:', error);
    return [];
  }
}

export async function addTransaction(tx: Omit<Transaction, 'id'>): Promise<Transaction> {
  if (!isNeonConfigured()) throw new Error('Database is not configured');

  try {
    const sql = neon(process.env.DATABASE_URL!);
    const rows = await sql`
      INSERT INTO transactions (member_id, member_name, amount, date, notes)
      VALUES (
        ${tx.memberId || null},
        ${tx.memberName},
        ${Number(tx.amount)},
        ${tx.date},
        ${tx.notes || ''}
      )
      RETURNING id, member_id as "memberId", member_name as "memberName", amount, date, notes, created_at as "createdAt"
    `;

    const res: any = rows[0];
    return {
      id: res.id,
      memberId: res.memberId,
      memberName: res.memberName,
      amount: Number(res.amount),
      date: new Date(res.date).toISOString().split('T')[0],
      notes: res.notes,
      createdAt: res.createdAt
    };
  } catch (error) {
    console.error('Failed to add transaction to Neon DB:', error);
    throw error;
  }
}

export async function updateTransaction(id: number, txData: Partial<Omit<Transaction, 'id'>>): Promise<Transaction | null> {
  if (!isNeonConfigured()) throw new Error('Database is not configured');

  try {
    const sql = neon(process.env.DATABASE_URL!);
    const current = (await sql`SELECT * FROM transactions WHERE id = ${id}`)[0];
    if (!current) return null;

    const updated = {
      memberId: txData.memberId !== undefined ? txData.memberId : current.member_id,
      memberName: txData.memberName ?? current.member_name,
      amount: txData.amount !== undefined ? Number(txData.amount) : Number(current.amount),
      date: txData.date ?? new Date(current.date).toISOString().split('T')[0],
      notes: txData.notes !== undefined ? txData.notes : (current.notes || '')
    };

    const rows = await sql`
      UPDATE transactions
      SET member_id = ${updated.memberId},
          member_name = ${updated.memberName},
          amount = ${updated.amount},
          date = ${updated.date},
          notes = ${updated.notes}
      WHERE id = ${id}
      RETURNING id, member_id as "memberId", member_name as "memberName", amount, date, notes, created_at as "createdAt"
    `;

    const res: any = rows[0];
    return {
      id: res.id,
      memberId: res.memberId,
      memberName: res.memberName,
      amount: Number(res.amount),
      date: new Date(res.date).toISOString().split('T')[0],
      notes: res.notes,
      createdAt: res.createdAt
    };
  } catch (error) {
    console.error('Failed to update transaction in Neon DB:', error);
    throw error;
  }
}

export async function deleteTransaction(id: number): Promise<boolean> {
  if (!isNeonConfigured()) throw new Error('Database is not configured');

  try {
    const sql = neon(process.env.DATABASE_URL!);
    await sql`DELETE FROM transactions WHERE id = ${id}`;
    return true;
  } catch (error) {
    console.error('Failed to delete transaction from Neon DB:', error);
    throw error;
  }
}

export async function getNewsletters(): Promise<NewsletterItem[]> {
  if (!isNeonConfigured()) {
    return fallbackNewsletters;
  }

  try {
    const sql = neon(process.env.DATABASE_URL!);
    const rows = await sql`
      SELECT id, title, description, image_url as "imageUrl", link_url as "linkUrl", category, date, created_at as "createdAt"
      FROM newsletters
      ORDER BY date DESC, id DESC
    `;

    return (rows || []).map((r: any) => ({
      ...r,
      date: new Date(r.date).toISOString().split('T')[0]
    })) as NewsletterItem[];
  } catch (error) {
    console.error('Neon DB getNewsletters failed:', error);
    return fallbackNewsletters;
  }
}

export async function addNewsletter(item: Omit<NewsletterItem, 'id'>): Promise<NewsletterItem> {
  if (!isNeonConfigured()) {
    const newId = fallbackNewsletters.length > 0 ? Math.max(...fallbackNewsletters.map(n => n.id)) + 1 : 1;
    const newItem: NewsletterItem = { ...item, id: newId };
    fallbackNewsletters.unshift(newItem);
    return newItem;
  }

  try {
    const sql = neon(process.env.DATABASE_URL!);
    const rows = await sql`
      INSERT INTO newsletters (title, description, image_url, link_url, category, date)
      VALUES (
        ${item.title},
        ${item.description},
        ${item.imageUrl},
        ${item.linkUrl},
        ${item.category || 'Update'},
        ${item.date || new Date().toISOString().split('T')[0]}
      )
      RETURNING id, title, description, image_url as "imageUrl", link_url as "linkUrl", category, date, created_at as "createdAt"
    `;

    const res: any = rows[0];
    return {
      id: res.id,
      title: res.title,
      description: res.description,
      imageUrl: res.imageUrl,
      linkUrl: res.linkUrl,
      category: res.category,
      date: new Date(res.date).toISOString().split('T')[0],
      createdAt: res.createdAt
    };
  } catch (error) {
    console.error('Failed to add newsletter to Neon DB:', error);
    throw error;
  }
}

export async function updateNewsletter(id: number, itemData: Partial<Omit<NewsletterItem, 'id'>>): Promise<NewsletterItem | null> {
  if (!isNeonConfigured()) {
    const index = fallbackNewsletters.findIndex(n => n.id === id);
    if (index === -1) return null;
    fallbackNewsletters[index] = { ...fallbackNewsletters[index], ...itemData };
    return fallbackNewsletters[index];
  }

  try {
    const sql = neon(process.env.DATABASE_URL!);
    const current = (await sql`SELECT * FROM newsletters WHERE id = ${id}`)[0];
    if (!current) return null;

    const updated = {
      title: itemData.title ?? current.title,
      description: itemData.description ?? current.description,
      imageUrl: itemData.imageUrl ?? current.image_url,
      linkUrl: itemData.linkUrl ?? current.link_url,
      category: itemData.category ?? current.category,
      date: itemData.date ?? new Date(current.date).toISOString().split('T')[0]
    };

    const rows = await sql`
      UPDATE newsletters
      SET title = ${updated.title},
          description = ${updated.description},
          image_url = ${updated.imageUrl},
          link_url = ${updated.linkUrl},
          category = ${updated.category},
          date = ${updated.date}
      WHERE id = ${id}
      RETURNING id, title, description, image_url as "imageUrl", link_url as "linkUrl", category, date, created_at as "createdAt"
    `;

    const res: any = rows[0];
    return {
      id: res.id,
      title: res.title,
      description: res.description,
      imageUrl: res.imageUrl,
      linkUrl: res.linkUrl,
      category: res.category,
      date: new Date(res.date).toISOString().split('T')[0],
      createdAt: res.createdAt
    };
  } catch (error) {
    console.error('Failed to update newsletter in Neon DB:', error);
    throw error;
  }
}

export async function deleteNewsletter(id: number): Promise<boolean> {
  if (!isNeonConfigured()) {
    const initialLen = fallbackNewsletters.length;
    fallbackNewsletters = fallbackNewsletters.filter(n => n.id !== id);
    return fallbackNewsletters.length < initialLen;
  }

  try {
    const sql = neon(process.env.DATABASE_URL!);
    await sql`DELETE FROM newsletters WHERE id = ${id}`;
    return true;
  } catch (error) {
    console.error('Failed to delete newsletter from Neon DB:', error);
    throw error;
  }
}

