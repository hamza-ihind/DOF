import { field, dateField, imageField, idField, HttpError } from './security';
import type { EventItem, Member } from './seedData';
export function memberInput(body: Record<string, unknown>): Omit<Member, 'id'> {
  const role = field(body.role, 'position', 120), bio = field(body.bio, 'biography', 3000, false);
  return { name: field(body.name, 'name', 120), role, roleEn: field(body.roleEn ?? role, 'English position', 120), roleFr: field(body.roleFr ?? role, 'French position', 120), photoUrl: imageField(body.photoUrl), bio, bioEn: field(body.bioEn ?? bio, 'English biography', 3000, false), bioFr: field(body.bioFr ?? bio, 'French biography', 3000, false), location: field(body.location, 'location', 255, false) };
}
export function eventInput(body: Record<string, unknown>): Omit<EventItem, 'id'> {
  const title = field(body.title, 'title', 200);
  const slug = field(body.slug || title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''), 'slug', 220);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new HttpError(400, 'Use lowercase letters, numbers and hyphens for the URL slug');
  const category = field(body.category, 'category') as EventItem['category'];
  if (!['School Refurbishment', 'Food Package Distribution', 'Spring of Life Well Drilling'].includes(category)) throw new HttpError(400, 'Invalid category');
  if (body.contributingMemberIds !== undefined && (!Array.isArray(body.contributingMemberIds) || body.contributingMemberIds.length > 100)) throw new HttpError(400, 'Invalid contributing members');
  if (body.timelineDays !== undefined && (!Array.isArray(body.timelineDays) || body.timelineDays.length > 60)) throw new HttpError(400, 'Invalid timeline');
  return { title, slug, category, date: dateField(body.date), location: field(body.location, 'location'), imageUrl: imageField(body.imageUrl), excerpt: field(body.excerpt, 'summary', 1000), content: field(body.content, 'report', 30000), impactSummary: field(body.impactSummary, 'impact summary', 255, false), contributingMemberIds: [...new Set(((body.contributingMemberIds || []) as unknown[]).map(idField))], timelineDays: ((body.timelineDays || []) as Record<string, unknown>[]).map((day, i) => ({ dayNumber: i + 1, title: field(day.title, 'day title'), date: dateField(day.date), description: field(day.description, 'day description', 5000), images: Array.isArray(day.images) && day.images.length <= 10 ? day.images.map(imageField) : [] })) };
}