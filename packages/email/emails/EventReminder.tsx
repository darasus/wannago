import {Container, Head, Html} from '@react-email/components';
import {Section} from './components/Section';
import * as React from 'react';
import {Header} from './components/Header';
import {buttonContainer, container, main, gutter} from './components/shared';
import {Button} from './components/Button';
import {Footer} from './components/Footer';
import {EventInfo} from './components/EventInfo';
import {Title} from './components/Title';

interface Props {
  title: string;
  startDate: string;
  endDate: string;
  eventUrl: string;
  address: string | 'none';
  organizerName: string;
}

export default function EventReminder({
  title = 'Event name',
  address = 'Paris, France',
  startDate = '2022/12/11 11:30',
  endDate = '2022/12/11 11:30',
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
            <Title>{`Your event is coming up!`}</Title>
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
          <Footer />
        </Container>
      </Section>
    </Html>
  );
}
