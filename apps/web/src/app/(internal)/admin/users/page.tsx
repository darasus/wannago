import {UsersTable} from './features/UsersTable/UsersTable';
import {api} from '../../../../trpc/server-http';

export default async function AdminPage() {
  const users = await api.admin.getAllUsers.query();

  return <UsersTable users={users} />;
}
