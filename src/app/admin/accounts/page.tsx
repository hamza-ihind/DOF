import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AccountApprovals from '@/components/AccountApprovals';
export default async function AccountsPage() {
  const session = await getSession(); if (session?.role !== 'admin') redirect(session ? '/account' : '/admin');
  return <AccountApprovals />;
}