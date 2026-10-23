import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import NewsletterManager from '@/components/NewsletterManager';
export default async function Page() { const session = await getSession(); if (session?.role !== 'admin') redirect(session ? '/account' : '/admin'); return <NewsletterManager />; }