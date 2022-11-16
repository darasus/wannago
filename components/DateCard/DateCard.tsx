import {add, format} from 'date-fns';
import {format as timeagoFormat} from 'timeago.js';
import {Card} from '../Card/Card';
import {SectionTitle} from '../Text/SectionTitle';
import {Text} from '../Text/Text';

interface Props {
  date: Date;
}

export function DateCard({date}: Props) {
  const end = add(new Date('2023/02/01'), {hours: 1, minutes: 30});

  return (
    <Card>
      <div className="flex items-center">
        <div className="grow">
          <SectionTitle color="yellow">When</SectionTitle>
          <div className="mb-2" />
          <Text className="font-bold">{format(date, 'EEEE, MMMM dd')}</Text>
          <div />
          <Text>{`${format(date, 'k:mm')} - ${format(end, 'k:mm')}`}</Text>
        </div>
        <div>
          <div className="flex flex-col justify-center items-center border rounded-xl px-4 py-3  shadow-md">
            <div className="h-1 bg-red-500 w-7 mb-3" />
            <Text className="text-lg font-bold leading-none">
              {timeagoFormat(date, 'en_US')}
            </Text>
          </div>
        </div>
      </div>
    </Card>
  );
}
