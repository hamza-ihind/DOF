export interface Member {
  id: number;
  name: string;
  role: string;
  photoUrl: string;
  bio: string;
  location: string;
  tier: 1 | 2 | 3;
}

export interface EventDay {
  dayNumber: number;
  title: string;
  date: string;
  description: string;
  images: string[];
}

export interface EventItem {
  id: number;
  slug: string;
  title: string;
  category: 'School Refurbishment' | 'Food Package Distribution' | 'Spring of Life Well Drilling';
  date: string;
  location: string;
  imageUrl: string;
  excerpt: string;
  content: string;
  impactSummary: string;
  contributingMemberIds: number[];
  timelineDays: EventDay[];
}

export const INITIAL_MEMBERS: Member[] = [];

export const INITIAL_EVENTS: EventItem[] = [];

export const MOCK_CAROUSEL_ITEMS: any[] = [];
