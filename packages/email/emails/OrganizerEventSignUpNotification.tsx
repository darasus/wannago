import {Container, Head, Html} from '@react-email/components';
import {Section} from './components/Section';
import * as React from 'react';
import {Header} from './components/Header';
import {buttonContainer, container, main, gutter} from './components/shared';
import {Footer} from './components/Footer';
import {Title} from './components/Title';
import {Button} from './components/Button';
import {Text} from './components/Text';

interface Props {
  eventTitle: string;
  userFullName: string;
  eventAttendeesUrl: string;
}

export default function OrganizerEventSignUpNotification({
  eventTitle = 'Event name',
  userFullName = 'Ilya Daraseliya',
  eventAttendeesUrl = 'https://www.wannago.app',
}: Props) {
  return (
    <Html>
      <Head />
      <Section style={main}>
        <Container style={container}>
          <Header />
          <Section>
            <Title>{`Your event has new sign up!`}</Title>
          </Section>
          <Section style={{marginBottom: gutter}}>
            <Text>
              <b>Name:</b> {userFullName}
            </Text>
            <Text>
              <b>Event:</b> {eventTitle}
            </Text>
          </Section>
          <Section style={buttonContainer}>
            <Button href={eventAttendeesUrl}>View attendees</Button>
          </Section>
          <Footer />
        </Container>
      </Section>
    </Html>
  );
}
