import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (session?.role !== 'admin') redirect(session ? '/account' : '/admin');
  return children;
}