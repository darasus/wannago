import {useOrg} from 'hooks';
import Image from 'next/image';
import {useState} from 'react';
import {Avatar, Button, CardBase, Modal, Text} from 'ui';
import {CreateMemberModal} from './CreateMemberModal';
import {TeamMember} from './TeamMember';

export function TeamSettings() {
  const {org, removeOrg, members, invitations} = useOrg();
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
