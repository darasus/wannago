import {Link} from './Link';
import {Text} from './Text';

interface Props {
  title: string;
  organizerName: string;
  startDate: string;
  endDate: string;
  address: string;
  streamUrl: string;
}

export function EventInfo({
  title,
  organizerName,
  startDate,
  endDate,
  address,
  streamUrl,
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
      {streamUrl !== 'none' && (
        <Text>
          <b>Stream URL:</b> <Link href={streamUrl}>{streamUrl}</Link>
        </Text>
      )}
    </>
  );
}
