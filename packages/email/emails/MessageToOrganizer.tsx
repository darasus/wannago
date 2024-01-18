import {Container, Head, Html} from '@react-email/components';
import {Section} from './components/Section';
import * as React from 'react';
import {Header} from './components/Header';
import {container, main, gutter} from './components/shared';
import {Text} from './components/Text';
import {Footer} from './components/Footer';
import {Title} from './components/Title';

interface Props {
  name: string;
  email: string;
  message: string;
}

export default function MessageToOrganizer({
  name = 'Ilia Daraselia',
  email = 'example@email.com',
  message = 'Test message',
}: Props) {
  return (
    <Html>
      <Head />
      <Section style={main}>
        <Container style={container}>
          <Header />
          <Section>
            <Title>{`Message from ${name} (${email})`}</Title>
          </Section>
          <Section style={{marginBottom: gutter}}>
            <Text>{message}</Text>
          </Section>
          <Footer />
        </Container>
      </Section>
    </Html>
  );
}
