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
  senderName: string;
  senderEmail: string;
  eventTitle: string;
  eventUrl: string;
  subject: string;
  message: string;
}

export default function MessageToOrganizer({
  senderName = 'Jon Doe',
  senderEmail = 'hi@example.com',
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
            <Title>{`${senderName} sent you a message`}</Title>
          </Section>
          <Section style={{marginBottom: gutter}}>
            <Text>
              <b>Event:</b>
              {` `}
              <Link href={eventUrl}>{eventTitle}</Link>
            </Text>
            <Text>
              <b>Email:</b>
              {` `}
              {`${senderEmail}`}
            </Text>
            <Text>
              <b>Name:</b>
              {` `}
              {senderName}
            </Text>
            <Text>
              <b>Subject:</b>
              {` `}
              {subject}
            </Text>
            <Text>
              <b>Message:</b>
              {` `}
              {message}
            </Text>
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
