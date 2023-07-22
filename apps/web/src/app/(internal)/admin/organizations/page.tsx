import {OrganizationsTable} from './features/OrganizationsTable/OrganizationsTable';
import {api} from '../../../../trpc/server-http';

export const runtime = 'edge';
export const preferredRegion = 'iad1';

export default async function AdminPage() {
  const organizations = await api.admin.getAllOrganizations.query();

  return <OrganizationsTable organizations={organizations} />;
}
