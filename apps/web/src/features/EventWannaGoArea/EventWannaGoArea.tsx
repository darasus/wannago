import {Button} from 'ui';
import {FeedbackFish} from '@feedback-fish/react';
import {useUser} from '@clerk/nextjs';

interface Props {
  eventId?: string;
}

export function EventWannaGoArea({eventId}: Props) {
  const {user} = useUser();

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4">
        <FeedbackFish
          projectId="f843146d960b2f"
          userId={user?.id}
          metadata={{eventid: eventId || ''}}
        >
          <Button variant="link" size="sm">
            Feedback
          </Button>
        </FeedbackFish>
      </div>
    </div>
  );
}
