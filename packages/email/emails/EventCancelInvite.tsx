import {Container} from '@react-email/container';
import {Head} from '@react-email/head';
import {Html} from '@react-email/html';
import {Section} from '@react-email/section';
import * as React from 'react';
import {EventInfo} from './components/EventInfo';
import {Header} from './components/Header';
import {buttonContainer, container, main, gutter} from './components/shared';
import {Footer} from './components/Footer';
import {Title} from './components/Title';
import {Button} from './components/Button';

interface Props {
  title: string;
  startDate: string;
  endDate: string;
  address: string | 'none';
  eventUrl: string;
  organizerName: string;
}

export default function EventCancelInvite({
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
            <Title>{`Your invite has been cancelled...`}</Title>
          </Section>
          <Section style={{marginBottom: gutter}}>
            <EventInfo
              organizerName={organizerName}
              title={title}
              startDate={startDate}
              endDate={endDate}
              address={address}
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
