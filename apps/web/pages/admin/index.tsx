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
              <th className="text-left border border-black">First name</th>
              <th className="text-left border border-black">Last name</th>
              <th className="text-left border border-black">Created at</th>
              <th className="text-left border border-black">Email</th>
              <th className="text-left border border-black">External id</th>
              <th className="text-left border border-black">Events</th>
            </tr>
          </thead>
          <tbody>
            {data?.map(user => {
              return (
                <tr className="border border-black">
                  <td className="border border-black">{user.firstName}</td>
                  <td className="border border-black">{user.lastName}</td>
                  <td className="border border-black">
                    {user.createdAt.toDateString()}
                  </td>
                  <td className="border border-black">{user.email}</td>
                  <td className="border border-black">{user.externalId}</td>
                  <td className="border border-black">
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
