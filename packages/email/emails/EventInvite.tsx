import {Container} from '@react-email/container';
import {Head} from '@react-email/head';
import {Hr} from '@react-email/hr';
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
  confirmUrl: string;
  organizerName: string;
}

export default function EventInvite({
  title = 'Event name',
  address = 'Paris, France',
  streamUrl = 'https://meet.google.com/xxx-xxx-xxx',
  endDate = '2022/12/11 11:30',
  startDate = '2022/12/11 11:30',
  confirmUrl = 'https://www.wannago.app',
  organizerName = 'Organizer Name',
}: Props) {
  return (
    <Html>
      <Head />
      <Section style={main}>
        <Container style={container}>
          <Header />
          <Section>
            <Title>{`You've been invited to: ${title}`}</Title>
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
            <Button href={confirmUrl}>Confirm invite</Button>
          </Section>
          <Hr style={hr} />
          <Text>Sincerely,</Text>
          <Link href="https://www.wannago.app">WannaGo Team</Link>
          <Footer />
        </Container>
      </Section>
    </Html>
  );
}
