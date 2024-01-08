import {Avatar, CardBase, Container, LoadingBlock, Text} from 'ui';
import {MessageButton} from './features/MessageButton/MessageButton';
import {Suspense} from 'react';
import {PublicEvents} from './features/PublicEvents/PublicEvents';
import {getConfig} from 'utils';

export async function PublicProfile() {
  const {name} = getConfig();

  return (
    <>
      <Container maxSize="sm" className="flex flex-col gap-y-4">
        <CardBase innerClassName="flex flex-col gap-2">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <Avatar
              className="shrink-0 h-40 w-40"
              src={'/assets/logo-dark.png'}
              alt={`avatar`}
              height={700}
              width={700}
            />
            <div className="flex flex-col max-w-full overflow-hidden">
              <Text
                className="text-3xl font-bold truncate"
                data-testid="user-profile-name"
              >
                {name}
              </Text>
              <div className="flex md:justify-start justify-center gap-2 mt-4">
                <MessageButton />
              </div>
            </div>
          </div>
        </CardBase>
        <Suspense fallback={<LoadingBlock />}>
          <PublicEvents />
        </Suspense>
      </Container>
    </>
  );
}
