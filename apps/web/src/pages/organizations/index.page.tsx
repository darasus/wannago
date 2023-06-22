import Head from 'next/head';
import {
  Avatar,
  Button,
  CardBase,
  Container,
  LoadingBlock,
  PageHeader,
  Text,
} from 'ui';
import {withProtected} from '../../utils/withAuthProtect';
import {trpc} from 'trpc/src/trpc';
import {Cog6ToothIcon, UserIcon} from '@heroicons/react/24/solid';

function SettingsPage() {
  const organizations = trpc.organization.getMyOrganizations.useQuery();

  return (
    <>
      <Head>
        <title>{`Organizations | WannaGo`}</title>
      </Head>
      <Container maxSize="sm">
        <div className="flex flex-col gap-y-4">
          <PageHeader title={'Organizations'} />
          <div>
            {organizations.isInitialLoading && <LoadingBlock />}
            {organizations.data?.map(o => (
              <CardBase>
                <div className="flex gap-4 items-center">
                  <Avatar src={o.logoSrc} width={50} height={50} alt={o.name} />
                  <Text>{o.name}</Text>
                  <div className="grow" />
                  <Button
                    as="a"
                    href={`/o/${o.id}`}
                    iconLeft={<UserIcon />}
                    variant="neutral"
                  />
                  <Button
                    as="a"
                    href={`/organizations/${o.id}/settings`}
                    iconLeft={<Cog6ToothIcon />}
                    variant="neutral"
                  />
                </div>
              </CardBase>
            ))}
          </div>
          {organizations.data?.length === 0 && (
            <Button>Create organization</Button>
          )}
        </div>
      </Container>
    </>
  );
}

export default withProtected(SettingsPage);
