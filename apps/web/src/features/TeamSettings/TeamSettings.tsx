import {useOrg} from 'hooks';
import {useState} from 'react';
import {Button, CardBase, Modal, Text} from 'ui';
import {CreateMemberModal} from './CreateMemberModal';
import {TeamMember} from './TeamMember';

export function TeamSettings() {
  const {org, removeOrg, members} = useOrg();
  const [isAddMemberDialogModalOpen, setIsAddMemberDialogModalOpen] =
    useState(false);

  if (!org) {
    return null;
  }

  return (
    <>
      <CreateMemberModal
        isOpen={isAddMemberDialogModalOpen}
        onClose={() => setIsAddMemberDialogModalOpen(false)}
      />
      <div className="flex flex-col gap-4">
        <CardBase title="Team">
          <div>
            <div>
              <div className="flex items-center">
                <div className="grow">
                  <Text>{org?.name}</Text>
                </div>
                <Button variant="danger" size="xs" onClick={removeOrg}>
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
              <div className="flex items-center">
                {members.map(member => {
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
