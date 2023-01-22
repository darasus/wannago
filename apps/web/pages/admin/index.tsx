import AppLayout from '../../components/AppLayout/AppLayout';
import {Container} from '../../components/Container/Container';
import {Table} from '../../components/Table/Table';
import {TBody} from '../../components/Table/TBody';
import {Td} from '../../components/Table/Td';
import {Th} from '../../components/Table/Th';
import {THead} from '../../components/Table/THead';
import {TRow} from '../../components/Table/TRow';
import {trpc} from '../../utils/trpc';

export default function AdminPage() {
  const {data} = trpc.admin.getAllRegisteredUsers.useQuery();

  return (
    <AppLayout maxSize="lg">
      <Container maxSize="lg">
        <Table>
          <THead>
            <TRow>
              <Th>First name</Th>
              <Th>Last name</Th>
              <Th>Created at</Th>
              <Th>Email</Th>
              <Th>External id</Th>
              <Th>Events</Th>
            </TRow>
          </THead>
          <TBody>
            {data?.map(user => {
              return (
                <TRow>
                  <Td>{user.firstName}</Td>
                  <Td>{user.lastName}</Td>
                  <Td>{user.createdAt.toDateString()}</Td>
                  <Td>{user.email}</Td>
                  <Td>{user.externalId}</Td>
                  <Td>
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
                  </Td>
                </TRow>
              );
            })}
          </TBody>
        </Table>
      </Container>
    </AppLayout>
  );
}
