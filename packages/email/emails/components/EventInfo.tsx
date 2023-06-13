import {Link} from './Link';
import {Section} from './Section';
import {Text} from './Text';

interface Props {
  title: string;
  organizerName: string;
  startDate: string;
  endDate: string;
  address: string;
  eventUrl: string;
}

export function EventInfo({
  title,
  organizerName,
  startDate,
  endDate,
  address,
  eventUrl,
}: Props) {
  return (
    <Section>
      <Text>
        <b>Event:</b> <Link href={eventUrl}>{title}</Link>
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
    </Section>
  );
}
