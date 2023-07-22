import {Container, Head, Html} from '@react-email/components';
import {Header} from './components/Header';
import {Section} from './components/Section';
import * as React from 'react';
import {container, main, gutter} from './components/shared';
import {Text} from './components/Text';
import {Footer} from './components/Footer';
import {Title} from './components/Title';

interface Props {
  code: string;
}

export default function LoginCode({code = '123123123'}: Props) {
  return (
    <Html>
      <Head />
      <Section style={main}>
        <Container style={container}>
          <Header />
          <Section>
            <Title>{`Verification code`}</Title>
          </Section>
          <Section style={{marginBottom: gutter}}>
            <Text>Enter the following verification code when prompted:</Text>
          </Section>
          <Section style={{marginBottom: gutter}}>
            <Text style={{fontSize: 40, fontWeight: 'bold'}}>{code}</Text>
          </Section>
          <Section style={{marginBottom: gutter}}>
            <Text>To protect your account, do not share this code.</Text>
          </Section>
          <Footer />
        </Container>
      </Section>
    </Html>
  );
}
