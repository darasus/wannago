import AppLayout from '../../components/AppLayout/AppLayout';
import {Container} from 'ui';
import {Table} from '../../components/Table/Table';
import {TBody} from '../../components/Table/TBody';
import {Td} from '../../components/Table/Td';
import {Th} from '../../components/Table/Th';
import {THead} from '../../components/Table/THead';
import {TRow} from '../../components/Table/TRow';
import {formatDate} from '../../utils/formatDate';
import {trpc} from '../../utils/trpc';

export default function AdminPage() {
  const {data} = trpc.admin.getAllRegisteredUsers.useQuery();

  return (
    <AppLayout maxSize="full">
      <Container maxSize="full">
        <Table>
          <THead>
            <TRow>
              <Th>#</Th>
              <Th>First name</Th>
              <Th>Last name</Th>
              <Th>Created at</Th>
              <Th>Email</Th>
              <Th>External id</Th>
              <Th>Events</Th>
            </TRow>
          </THead>
          <TBody>
            {data?.map((user, i) => {
              return (
                <TRow>
                  <Td>{data.length - i}</Td>
                  <Td>{user.firstName}</Td>
                  <Td>{user.lastName}</Td>
                  <Td>{formatDate(user.createdAt, 'dd MMM, HH:mm')}</Td>
                  <Td>{user.email}</Td>
                  <Td>{user.externalId}</Td>
                  <Td>
                    {user.organization?.events.map(event => {
                      const status = event.isPublished ? 'published' : 'draft';
                      const signUpCount = event.isPublished
                        ? event.eventSignUps.length
                        : 0;
                      const label = `${event.title} (${status}) - ${signUpCount} sign ups`;

                      return (
                        <>
                          <a
                            className="underline"
                            href={`/event/${event.id}`}
                            rel="noreferrer"
                          >
                            {label}
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
