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
  address: string | 'none';
  eventUrl: string;
  organizerName: string;
}

export default function EventInvite({
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
            <Title>{`You've been invited!`}</Title>
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
          <Section style={{...buttonContainer, maxWidth: 250}}>
            <Button href={eventUrl}>View event</Button>
          </Section>
          <Footer />
        </Container>
      </Section>
    </Html>
  );
}
