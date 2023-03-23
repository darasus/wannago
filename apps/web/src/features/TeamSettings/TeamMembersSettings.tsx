import {useConfirmDialog, useCurrentOrganization} from 'hooks';
import {useState} from 'react';
import {Button, CardBase} from 'ui';
import {CreateMemberModal} from './CreateMemberModal';
import {TeamMember} from './TeamMember';

export function TeamMembersSettings() {
  const {clerkOrganization, removeOrg, members, invitations} =
    useCurrentOrganization();
  const [isAddMemberDialogModalOpen, setIsAddMemberDialogModalOpen] =
    useState(false);
  const {modal, open} = useConfirmDialog({
    title: 'Are you sure you want to remove your team?',
    description: 'This will remove your team and all its members',
    async onConfirm() {
      await removeOrg();
    },
  });

  if (!clerkOrganization) {
    return null;
  }

  return (
    <>
      {modal}
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
          <div>
            <div>
              <div className="flex flex-col gap-y-2">
                {members.map(member => {
                  return <TeamMember key={member.id} member={member} />;
                })}
                {invitations.map(member => {
                  return <TeamMember key={member.id} member={member} />;
                })}
              </div>
            </div>
          </div>
        </CardBase>
      </div>
    </>
  );
}
