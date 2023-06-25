import {UserIcon, Cog6ToothIcon} from '@heroicons/react/24/solid';
import {Organization} from '@prisma/client';
import {o} from 'ramda';
import {CardBase, Avatar, Button, Text} from 'ui';

interface OrganizationCardProps {
  organization: Pick<Organization, 'id' | 'logoSrc' | 'name'>;
}

export function OrganizationCard({organization}: OrganizationCardProps) {
  return (
    <CardBase data-testid="organization-item-card">
      <div className="flex gap-4 items-center">
        <Avatar
          src={organization.logoSrc}
          width={50}
          height={50}
          alt={o.name}
        />
        <Text>{organization.name}</Text>
        <div className="grow" />
        <Button
          as="a"
          href={`/o/${organization.id}`}
          iconLeft={<UserIcon />}
          variant="neutral"
          data-testid="organization-item-card-profile-button"
        />
        <Button
          as="a"
          href={`/organizations/${organization.id}/settings`}
          iconLeft={<Cog6ToothIcon />}
          variant="neutral"
          data-testid="organization-item-card-settings-button"
        />
      </div>
    </CardBase>
  );
}
