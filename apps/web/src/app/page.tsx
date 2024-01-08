import {PublicProfile} from 'features/src/PublicProfile/PublicProfile';
import {getConfig} from 'utils';

export const metadata = {
  title: getConfig().name,
};

export default async function HomePage() {
  return (
    <PublicProfile
      id={organization.id}
      name={organization.name}
      imageSrc={organization.logoSrc}
    />
  );
}
