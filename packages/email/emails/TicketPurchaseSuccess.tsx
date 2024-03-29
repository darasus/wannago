import {Container, Head, Html} from '@react-email/components';
import {Section} from './components/Section';
import * as React from 'react';
import {Header} from './components/Header';
import {buttonContainer, container, main, gutter} from './components/shared';
import {Button} from './components/Button';
import {EventInfo} from './components/EventInfo';
import {Footer} from './components/Footer';
import {Title} from './components/Title';

interface Props {
  title: string;
  startDate: string;
  endDate: string;
  address: string | 'none';
  eventUrl: string;
  ticketUrl: string;
  organizerName: string;
  numberOfTickets: number;
}

export default function TicketPurchaseSuccess({
  title = 'Event name',
  address = 'Paris, France',
  endDate = '2022/12/11 11:30',
  startDate = '2022/12/11 11:30',
  eventUrl = 'https://www.wannago.app',
  ticketUrl = 'https://www.wannago.app',
  organizerName = 'Organizer Name',
  numberOfTickets = 2,
}: Props) {
  return (
    <Html>
      <Head />
      <Section style={main}>
        <Container style={container}>
          <Header />
          <Section>
            {numberOfTickets === 1 ? (
              <Title>{`You just bought 1 ticket!`}</Title>
            ) : (
              <Title>{`You just bought ${numberOfTickets} tickets!`}</Title>
            )}
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
            <Button href={ticketUrl}>{`View your ticket${
              numberOfTickets > 1 ? 's' : ''
            }`}</Button>
          </Section>
          <Footer />
        </Container>
      </Section>
    </Html>
  );
}
