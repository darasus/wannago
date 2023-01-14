import AppLayout from '../../components/AppLayout/AppLayout';
import {Container} from '../../components/Container/Container';
import {trpc} from '../../utils/trpc';

export default function AdminPage() {
  const {data} = trpc.admin.getAllRegisteredUsers.useQuery();

  return (
    <AppLayout>
      <Container>
        <table className="table-auto border border-black w-full">
          <thead>
            <tr>
              <th className="text-left">First name</th>
              <th className="text-left">Last name</th>
              <th className="text-left">Email</th>
              <th className="text-left">External id</th>
              <th className="text-left">Events</th>
            </tr>
          </thead>
          <tbody>
            {data?.map(user => {
              return (
                <tr>
                  <td>{user.firstName}</td>
                  <td>{user.lastName}</td>
                  <td>{user.email}</td>
                  <td>{user.externalId}</td>
                  <td>
                    {user.organization?.events.map(event => {
                      return (
                        <>
                          <a
                            className="underline"
                            href={`/e/${event.shortId}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {`${event.title} (${
                              event.isPublished ? 'published' : 'draft'
                            })`}
                          </a>
                          <br />
                        </>
                      );
                    })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Container>
    </AppLayout>
  );
}
