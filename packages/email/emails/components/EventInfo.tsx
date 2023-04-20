import {Text} from './Text';

interface Props {
  title: string;
  organizerName: string;
  startDate: string;
  endDate: string;
  address: string;
}

export function EventInfo({
  title,
  organizerName,
  startDate,
  endDate,
  address,
}: Props) {
  return (
    <>
      <Text>
        <b>Event:</b> {title}
      </Text>
      <Text>
        <b>Organizer:</b> {organizerName}
      </Text>
      <Text>
        <b>Start:</b> {startDate}
      </Text>
      <Text>
        <b>End:</b> {endDate}
      </Text>
      {address !== 'none' && (
        <Text>
          <b>Address:</b> {address}
        </Text>
      )}
    </>
  );
}
