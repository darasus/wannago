import {User, Cog} from 'lucide-react';
import {Organization} from '@prisma/client';
import Link from 'next/link';
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
          asChild
          variant="outline"
          data-testid="organization-item-card-profile-button"
          size="icon"
        >
          <Link href={`/o/${organization.id}`}>
            <User />
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          data-testid="organization-item-card-settings-button"
          size="icon"
        >
          <Link href={`/organizations/${organization.id}/settings`}>
            <Cog />
          </Link>
        </Button>
      </div>
    </CardBase>
  );
}
