import {useMyOrganizationMembersQuery, useMyOrganizationQuery} from 'hooks';
import {useState} from 'react';
import {Button, CardBase} from 'ui';
import {CreateMemberModal} from './CreateMemberModal';
import {TeamMember} from './TeamMember';

export function TeamMembersSettings() {
  const organization = useMyOrganizationQuery();
  const [isAddMemberDialogModalOpen, setIsAddMemberDialogModalOpen] =
    useState(false);
  const members = useMyOrganizationMembersQuery();

  if (!organization.data) return null;

  return (
    <>
      <CreateMemberModal
        isOpen={isAddMemberDialogModalOpen}
        onClose={() => setIsAddMemberDialogModalOpen(false)}
      />
      <div className="flex flex-col gap-4">
        <CardBase
          title={'Team members'}
          titleChildren={
            <Button
              size="xs"
              variant="neutral"
              onClick={() => setIsAddMemberDialogModalOpen(true)}
            >
              Add member
            </Button>
          }
        >
          <div className="flex flex-col gap-y-2">
            {members.data?.map(member => {
              return <TeamMember key={member.id} member={member} />;
            })}
          </div>
        </CardBase>
      </div>
    </>
  );
}
