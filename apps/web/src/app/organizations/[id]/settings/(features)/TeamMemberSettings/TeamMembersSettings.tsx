'use client';

import {use, useState} from 'react';
import {Button, CardBase} from 'ui';
import {CreateMemberModal} from '../CreateMemberModal/CreateMemberModal';
import {TeamMember} from '../TeamMember/TeamMember';
import {Organization} from '@prisma/client';
import {RouterOutputs} from 'api';

interface Props {
  organization: Organization;
  membersPromise: Promise<
    RouterOutputs['organization']['getMyOrganizationMembers']
  >;
}

export function TeamMembersSettings({organization, membersPromise}: Props) {
  const [isAddMemberDialogModalOpen, setIsAddMemberDialogModalOpen] =
    useState(false);
  const members = use(membersPromise);

  if (!organization) {
    return null;
  }

  return (
    <>
      <CreateMemberModal
        organization={organization}
        isOpen={isAddMemberDialogModalOpen}
        onClose={() => setIsAddMemberDialogModalOpen(false)}
      />
      <div className="flex flex-col gap-4">
        <CardBase
          title={'Team members'}
          titleChildren={
            <Button
              size="sm"
              variant="link"
              onClick={() => setIsAddMemberDialogModalOpen(true)}
            >
              Add member
            </Button>
          }
        >
          <div className="flex flex-col gap-y-2">
            {members.map((member) => {
              return (
                <TeamMember
                  key={member.id}
                  member={member}
                  organization={organization}
                />
              );
            })}
          </div>
        </CardBase>
      </div>
    </>
  );
}
