import {Button} from '../../Button/Button';
import {FeedbackFish} from '@feedback-fish/react';
import {useUser} from '@clerk/nextjs';
import {PublicEventBranding} from '../../PublicEventBranding/PublicEventBranding';

interface Props {
  eventId: string;
}

export function EventWannaGoArea({eventId}: Props) {
  const {user} = useUser();

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4">
        <FeedbackFish
          projectId="f843146d960b2f"
          userId={user?.id}
          metadata={{eventId}}
        >
          <Button
            variant="link"
            size="sm"
            className="text-gray-700 border-b-2 border-b-gray-700"
          >
            Feedback
          </Button>
        </FeedbackFish>
      </div>
      <div>
        <PublicEventBranding />
      </div>
    </div>
  );
}
