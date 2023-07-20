import {Container} from '@react-email/container';
import {Head} from '@react-email/head';
import {Html} from '@react-email/html';
import {Section} from './components/Section';
import * as React from 'react';
import {Header} from './components/Header';
import {buttonContainer, container, main, gutter} from './components/shared';
import {Button} from './components/Button';
import {Footer} from './components/Footer';
import {EventInfo} from './components/EventInfo';
import {EventDisclaimer} from './components/EventDisclaimer';
import {Title} from './components/Title';

interface Props {
  title: string;
  startDate: string;
  endDate: string;
  address: string | 'none';
  eventUrl: string;
  organizerName: string;
}

export default function EventSignUp({
  title = 'Event name',
  address = 'Paris, France',
  endDate = '2022/12/11 11:30',
  startDate = '2022/12/11 11:30',
  eventUrl = 'https://www.wannago.app',
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
              eventUrl={eventUrl}
            />
          </Section>
          <Section style={buttonContainer}>
            <Button href={eventUrl}>View event</Button>
          </Section>
          <EventDisclaimer />
          <Footer />
        </Container>
      </Section>
    </Html>
  );
}
