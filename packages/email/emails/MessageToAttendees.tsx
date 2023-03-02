import {Container} from '@react-email/container';
import {Head} from '@react-email/head';
import {Hr} from '@react-email/hr';
import {Html} from '@react-email/html';
import {Section} from '@react-email/section';
import * as React from 'react';
import {Header} from './components/Header';
import {container, hr, main, gutter} from './components/shared';
import {Text} from './components/Text';
import {Footer} from './components/Footer';
import {Title} from './components/Title';
import {Link} from './components/Link';

interface Props {
  eventTitle: string;
  eventUrl: string;
  subject: string;
  message: string;
}

export default function MessageToAttendees({
  eventUrl = 'https://www.wannago.app',
  eventTitle = 'Event name',
  subject = 'Test subject',
  message = 'Test message',
}: Props) {
  return (
    <Html>
      <Head />
      <Section style={main}>
        <Container style={container}>
          <Header />
          <Section>
            <Title>
              {`Message from organizer of `}
              <Link href={eventUrl}>{eventTitle}</Link>
            </Title>
          </Section>
          <Section style={{marginBottom: gutter}}>
            <Text>
              <b>{subject}</b>
            </Text>
            <Text>{message}</Text>
          </Section>
          <Hr style={hr} />
          <Text>
            Simply reply to this email if you want to respond to this message.
          </Text>
          <Footer />
        </Container>
      </Section>
    </Html>
  );
}
