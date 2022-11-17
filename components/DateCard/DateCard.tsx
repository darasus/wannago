import {add, format} from 'date-fns';
import {format as timeagoFormat} from 'timeago.js';
import {Button} from '../Button/Button';
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
      <div className="mb-2">
        <SectionTitle color="yellow" className="mr-2">
          When
        </SectionTitle>
        <Button variant="link-neutral">Add to calendar</Button>
      </div>
      <div className="flex mb-2">
        <div className="grow">
          <Text className="font-bold capitalize">
            {format(date, 'EEEE, MMMM dd')}
          </Text>{' '}
          <Text className="text-gray-500">{`(${timeagoFormat(
            date,
            'en_US'
          )})`}</Text>
          <div />
          <Text>{`${format(date, 'k:mm')} - ${format(end, 'k:mm')}`}</Text>
        </div>
        <div>
          <div className="flex flex-col justify-center items-center border rounded-xl px-4 py-2  shadow-md">
            <div className="h-0.5 bg-red-500 w-5 mb-1" />
            <Text className="text-2xl leading-none">{format(date, 'dd')}</Text>
            <div />
            <Text className="uppercase text-xs leading-none text-gray-500">
              {format(date, 'LLL')}
            </Text>
          </div>
        </div>
      </div>
    </Card>
  );
}
