import {format} from 'date-fns';
import {format as timeagoFormat} from 'timeago.js';
import {Button} from '../Button/Button';
import {Card} from '../Card/Card';
import {SectionTitle} from '../Text/SectionTitle';
import {Text} from '../Text/Text';

interface Props {
  startDate: Date;
  endDate: Date;
}

export function DateCard({startDate, endDate}: Props) {
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
            {format(startDate, 'EEEE, MMMM dd')}
          </Text>{' '}
          <Text className="text-gray-500">{`(${timeagoFormat(
            startDate,
            'en_US'
          )})`}</Text>
          <div />
          <Text>{`${format(startDate, 'k:mm')} - ${format(
            endDate,
            'k:mm'
          )}`}</Text>
        </div>
        <div>
          <div className="flex flex-col justify-center items-center border rounded-xl px-4 py-2  shadow-md">
            <div className="h-0.5 bg-red-500 w-5 mb-1" />
            <Text className="text-2xl leading-none">
              {format(startDate, 'dd')}
            </Text>
            <div />
            <Text className="uppercase text-xs leading-none text-gray-500">
              {format(startDate, 'LLL')}
            </Text>
          </div>
        </div>
      </div>
    </Card>
  );
}
