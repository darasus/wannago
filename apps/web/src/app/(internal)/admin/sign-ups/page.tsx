import {SignUpsTable} from './features/SignUpsTable/SignUpsTable';
import {api} from '../../../../trpc/server-http';

export default async function AdminPage() {
  const signUps = await api.admin.getAllSignUps.query();

  return <SignUpsTable signUps={signUps} />;
}
