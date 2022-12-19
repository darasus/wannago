import {Container} from '@react-email/container';
import {Head} from '@react-email/head';
import {Hr} from '@react-email/hr';
import {Html} from '@react-email/html';
import {Preview} from '@react-email/preview';
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
} from './components';

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
          <Text>Thanks,</Text>
          <Link href="https://www.wannago.app">WannaGo Team</Link>
          <Footer />
        </Container>
      </Section>
    </Html>
  );
}