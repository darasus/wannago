import {Container} from '@react-email/container';
import {Head} from '@react-email/head';
import {Hr} from '@react-email/hr';
import {Html} from '@react-email/html';
import {Section} from '@react-email/section';
import * as React from 'react';
import {
  container,
  Header,
  hr,
  main,
  Text,
  Title,
  Link,
  Footer,
  gutter,
} from './components';

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
          <Hr style={hr} />
          <Text>Sincerely,</Text>
          <Link href="https://www.wannago.app">WannaGo Team</Link>
          <Footer />
        </Container>
      </Section>
    </Html>
  );
}
