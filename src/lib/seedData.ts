export interface Member {
  id: number;
  name: string;
  role: string;
  roleEn?: string;
  roleFr?: string;
  photoUrl: string;
  bio: string;
  bioEn?: string;
  bioFr?: string;
  location: string;
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

export interface Transaction {
  id: number;
  memberId?: number | null;
  memberName: string;
  amount: number;
  date: string;
  notes?: string;
  createdAt?: string;
}

export const INITIAL_MEMBERS: Member[] = [];
export const INITIAL_EVENTS: EventItem[] = [];
export const INITIAL_TRANSACTIONS: Transaction[] = [];
