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
} from './components';

interface Props {
  title: string;
  startDate: string;
  address: string;
  eventUrl: string;
}

export default function EventReminder({
  title = 'Event name',
  address = '2022/12/11 11:3',
  startDate = '2022/12/11 11:3',
  eventUrl = 'https://www.wannago.app',
}: Props) {
  return (
    <Html>
      <Head />
      <Section style={main}>
        <Container style={container}>
          <Header />
          <Section>
            <Title>{`Your event is coming up!`}</Title>
          </Section>
          <Section style={{marginBottom: gutter}}>
            <Text>
              <b>Event:</b>
              {` `}
              {title}
            </Text>
            <Text>
              <b>Start:</b>
              {` `}
              {startDate}
            </Text>
            <Text>
              <b>Address:</b>
              {` `}
              {address}
            </Text>
          </Section>
          <Section style={buttonContainer}>
            <Button href={eventUrl}>View event</Button>
          </Section>
          <Hr style={hr} />
          <Text>
            {
              "If you didn't sign up to this event, you can safely ignore this email."
            }
          </Text>
          <Text>Sincerely,</Text>
          <Link href="https://www.wannago.app">WannaGo Team</Link>
          <Footer />
        </Container>
      </Section>
    </Html>
  );
}
