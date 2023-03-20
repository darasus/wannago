import {useConfirmDialog, useOrg} from 'hooks';
import {useState} from 'react';
import {Avatar, Button, CardBase, Text} from 'ui';
import {CreateMemberModal} from './CreateMemberModal';
import {TeamMember} from './TeamMember';

export function TeamSettings() {
  const {org, removeOrg, members, invitations} = useOrg();
  const [isAddMemberDialogModalOpen, setIsAddMemberDialogModalOpen] =
    useState(false);
  const {modal, open} = useConfirmDialog({
    title: 'Are you sure you want to remove your team?',
    description: 'This will remove your team and all its members',
    async onConfirm() {
      await removeOrg();
    },
  });

  if (!org) {
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
        <CardBase title="Team">
          <div>
            <div>
              <div className="flex items-center gap-x-2">
                {org?.logoUrl && (
                  <Avatar
                    className="h-10 w-10"
                    src={org?.logoUrl}
                    alt={org.name}
                    style={{objectFit: 'cover'}}
                  />
                )}
                <div className="grow">
                  <Text>{org.name}</Text>
                </div>
                <Button variant="danger" size="xs" onClick={open}>
                  remove
                </Button>
              </div>
            </div>
          </div>
        </CardBase>
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
