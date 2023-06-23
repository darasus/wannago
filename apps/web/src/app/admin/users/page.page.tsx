import {withProtected} from '../../../utils/withAuthProtect';
import {UsersTable} from './(features)/UsersTable/UsersTable';
import {api} from '../../../trpc/server';

async function AdminPage() {
  const users = await api.admin.getAllUsers.query();

  return <UsersTable users={users} />;
}

export default withProtected(AdminPage);
