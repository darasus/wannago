import {SignUpsTable} from './features/SignUpsTable/SignUpsTable';
import {api} from '../../../../trpc/server-http';

export const runtime = 'edge';
export const preferredRegion = 'iad1';

export default async function AdminPage() {
  const signUps = await api.admin.getAllSignUps.query();

  return <SignUpsTable signUps={signUps} />;
}
