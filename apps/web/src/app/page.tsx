import {Avatar, CardBase, Container, LoadingBlock, Text} from 'ui';
import {Suspense} from 'react';
import {PublicEvents, MessageButton} from 'features';
import {getConfig} from 'utils';

export const metadata = {
  title: getConfig().name,
};

export default async function HomePage() {
  const {name, logoSrc} = getConfig();

  return (
    <>
      <Container maxSize="sm" className="flex flex-col gap-y-4">
        <CardBase innerClassName="flex flex-col gap-2">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <Avatar
              className="shrink-0 h-40 w-40"
              src={logoSrc}
              alt={`avatar`}
              height={700}
              width={700}
              data-testid="profile-image"
            />
            <div className="flex flex-col max-w-full overflow-hidden gap-2">
              <Text
                className="text-3xl font-bold truncate"
                data-testid="profile-name"
              >
                {name}
              </Text>
              <div className="flex">
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
