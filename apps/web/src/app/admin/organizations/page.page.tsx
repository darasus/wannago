import {withProtected} from '../../../utils/withAuthProtect';
import {OrganizationsTable} from './(features)/OrganizationsTable/OrganizationsTable';
import {api} from '../../../trpc/server';

async function AdminPage() {
  const organizations = await api.admin.getAllOrganizations.query();

  return <OrganizationsTable organizations={organizations} />;
}

export default withProtected(AdminPage);
