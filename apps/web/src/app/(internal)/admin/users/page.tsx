import {UsersTable} from './features/UsersTable/UsersTable';
import {api} from '../../../../trpc/server-http';

export const runtime = 'nodejs';
export const preferredRegion = 'iad1';

export default async function AdminPage() {
  const users = await api.admin.getAllUsers.query();

  return <UsersTable users={users} />;
}
