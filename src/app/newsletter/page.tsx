import React from 'react';
import { getNewsletters } from '@/lib/db';
import NewsletterView from './NewsletterView';

export const metadata = {
  title: 'Newsletter & Media | Defenders of Future',
  description: 'Latest association updates, video reports, social media posts, and field news from Defenders of Future in Biougra, Morocco.',
};

export const revalidate = 30;

export default async function NewsletterPage() {
  const newsletters = await getNewsletters();

  return <NewsletterView newsletters={newsletters} />;
}
