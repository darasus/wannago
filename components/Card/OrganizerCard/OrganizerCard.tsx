import clsx from 'clsx';
import {CardBase} from '../CardBase/CardBase';
import {Badge} from '../../Badge/Badge';
import {Text} from '../../Text/Text';
import {Event} from '@prisma/client';
import {trpc} from '../../../utils/trpc';
import {Button} from '../../Button/Button';

interface Props {
  event: Event;
}

export function OrganizerCard({event}: Props) {
  const {data} = trpc.event.getEventOrganizer.useQuery({
    eventId: event.id,
  });

  return (
    <>
      <CardBase>
        <div>
          <div className="mb-2">
            <Badge color="pink" className="mr-2">
              Who
            </Badge>
            <Button variant="link-neutral">Ask a question</Button>
          </div>
          <Text className="font-bold">{`${data?.firstName} ${data?.lastName}`}</Text>
        </div>
      </CardBase>
    </>
  );
}
