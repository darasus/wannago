import {Container} from '@react-email/container';
import {Head} from '@react-email/head';
import {Column} from '@react-email/column';
import {Row} from '@react-email/row';
import {Html} from '@react-email/html';
import {Section} from '@react-email/section';
import * as React from 'react';
import {
  buttonContainer,
  container,
  Header,
  hr,
  main,
  Text,
  Title,
  Link,
  Button,
  Footer,
  gutter,
  EventInfo,
} from './components';

interface Props {
  title: string;
  startDate: string;
  endDate: string;
  address: string | 'none';
  streamUrl: string | 'none';
  eventUrl: string;
  cancelEventUrl: string;
  organizerName: string;
}

export default function EventSignUp({
  title = 'Event name',
  address = 'Paris, France',
  streamUrl = 'https://meet.google.com/xxx-xxx-xxx',
  endDate = '2022/12/11 11:30',
  startDate = '2022/12/11 11:30',
  eventUrl = 'https://www.wannago.app',
  cancelEventUrl = 'https://www.wannago.app',
  organizerName = 'Organizer Name',
}: Props) {
  return (
    <Html>
      <Head />
      <Section style={main}>
        <Container style={container}>
          <Header />
          <Section>
            <Title>{`You have signed up!`}</Title>
          </Section>
          <Section style={{marginBottom: gutter}}>
            <EventInfo
              organizerName={organizerName}
              title={title}
              startDate={startDate}
              endDate={endDate}
              address={address}
              streamUrl={streamUrl}
            />
          </Section>
          <Section style={buttonContainer}>
            <Button href={eventUrl}>View event</Button>
          </Section>
          <Text>
            Or you can cancel you sign up by following this{' '}
            <Link href={cancelEventUrl}>link</Link>.
          </Text>
          <Text>
            {
              "If you didn't sign up to this event, you can safely ignore this email."
            }
          </Text>
          <Footer />
        </Container>
      </Section>
    </Html>
  );
}
