import {useMe} from 'hooks';
import {useState} from 'react';
import {Badge, Button, CardBase, Text} from 'ui';
import {AddEmailModal} from './AddEmailModal';

export function EmailSettingsCard() {
  const {clerkMe} = useMe();
  const [isEmailModalVisible, setIsEmailModalVisible] = useState(false);
  const [isOTPModalVisible, setIsOTPModalVisible] = useState(false);

  return (
    <CardBase>
      <AddEmailModal
        isCodeFormOpen={isOTPModalVisible}
        isEmailFormOpen={isEmailModalVisible}
        onClose={() => {
          setIsEmailModalVisible(false);
          setIsOTPModalVisible(false);
        }}
      />
      <div className="flex flex-col gap-y-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Text className="text-md font-bold">Email</Text>
            <Button
              size="xs"
              variant="neutral"
              onClick={() => setIsEmailModalVisible(true)}
            >
              Add email
            </Button>
          </div>
          <div className="flex flex-col divide-y">
            {clerkMe?.emailAddresses.sort().map(email => {
              const getColor = () => {
                if (!email.verification.status) {
                  return 'gray';
                }

                if (email.verification.status === 'verified') {
                  return 'green';
                }

                return 'gray';
              };

              const getLabel = () => {
                if (clerkMe.primaryEmailAddressId === email.id) {
                  return 'primary';
                }

                if (!email.verification.status) {
                  return 'unverified';
                }

                if (email.verification.status) {
                  return email.verification.status;
                }

                return 'unknown';
              };

              const handleRemove = async () => {
                await email.destroy();
              };

              const handleMakePrimary = async () => {
                await clerkMe.update({primaryEmailAddressId: email.id});
              };

              const isPrimary = clerkMe.primaryEmailAddressId === email.id;
              const isVerified = email.verification.status === 'verified';

              return (
                <div
                  key={email.id}
                  className="flex flex-col md:flex-row md:items-center gap-x-2 py-2 first:pt-0 last:pb-0"
                >
                  <div className="grow truncate">
                    <Text title={email.emailAddress} className="truncate">
                      {email.emailAddress}
                    </Text>
                  </div>
                  <div className="flex gap-2 items-start shrink-0">
                    <Badge size="xs" color={getColor()}>
                      {getLabel()}
                    </Badge>
                    {!isVerified && (
                      <Button
                        size="xs"
                        onClick={() => {
                          setIsOTPModalVisible(true);
                        }}
                        disabled={isPrimary}
                      >
                        Verify
                      </Button>
                    )}
                    {!isPrimary && (
                      <>
                        <Button
                          size="xs"
                          variant="neutral"
                          onClick={handleMakePrimary}
                          disabled={isPrimary}
                        >
                          Make primary
                        </Button>
                        <Button
                          size="xs"
                          variant="danger"
                          onClick={handleRemove}
                          disabled={isPrimary}
                        >
                          Delete
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </CardBase>
  );
}
