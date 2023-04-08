import {Container, Td, Th, THead, TRow, Table, TBody} from 'ui';
import {formatDate} from 'utils';
import {trpc} from 'trpc/src/trpc';
import {withProtected} from '../../utils/withAuthProtect';

function AdminPage() {
  const {data} = trpc.admin.getAllRegisteredUsers.useQuery();

  if (!data) {
    return null;
  }

  return (
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
                  {user.events.map(event => {
                    const status = event.isPublished ? 'published' : 'draft';
                    const signUpCount = event.isPublished
                      ? event.eventSignUps.length
                      : 0;
                    const label = `${event.title} (${status}) - ${signUpCount} sign ups`;

                    return (
                      <>
                        <a
                          className="underline"
                          href={`/e/${event.shortId}`}
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
  );
}

export default withProtected(AdminPage);
