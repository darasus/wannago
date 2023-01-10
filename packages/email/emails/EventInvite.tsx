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
  endDate: string;
  address: string;
  confirmUrl: string;
  organizerName: string;
}

export default function EventInvite({
  title = 'Event name',
  address = '2022/12/11 11:30',
  endDate = '2022/12/11 11:30',
  startDate = '2022/12/11 11:30',
  confirmUrl = 'https://www.wannago.app',
  organizerName = 'Organizer Name',
}: Props) {
  return (
    <Html>
      <Head />
      <Section style={main}>
        <Container style={container}>
          <Header />
          <Section>
            <Title>{`You've been invited to: ${title}`}</Title>
          </Section>
          <Section style={{marginBottom: gutter}}>
            <Text>
              <b>Organizer:</b> {organizerName}
            </Text>
            <Text>
              <b>Start:</b> {startDate}
            </Text>
            <Text>
              <b>End:</b> {endDate}
            </Text>
            <Text>
              <b>Address:</b> {address}
            </Text>
          </Section>
          <Section style={buttonContainer}>
            <Button href={confirmUrl}>Confirm invite</Button>
          </Section>
          <Hr style={hr} />
          <Text>Thanks,</Text>
          <Link href="https://www.wannago.app">WannaGo Team</Link>
          <Footer />
        </Container>
      </Section>
    </Html>
  );
}
