import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import MemberAccount from '@/components/MemberAccount';
export const dynamic = 'force-dynamic';
export default async function Account() {
  const session = await getSession(); if (!session) redirect('/login'); if (session.role === 'admin') redirect('/admin');
  return <MemberAccount name={session.name} active={session.status === 'active'} />;
}