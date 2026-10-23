import React from 'react';
import { getMembers } from '@/lib/db';
import MembersView from './MembersView';

export const metadata = {
  title: 'Executive Bureau | Defenders of Future',
  description: 'Executive Bureau, team members and volunteers of Defenders of Future association.',
};

export const dynamic = 'force-dynamic';

export default async function MembersPage() {
  const members = await getMembers();

  return <MembersView members={members} />;
}
