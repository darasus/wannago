import {Container, Head, Html} from '@react-email/components';
import {Section} from './components/Section';
import * as React from 'react';
import {Header} from './components/Header';
import {buttonContainer, container, main} from './components/shared';
import {Button} from './components/Button';
import {Footer} from './components/Footer';
import {Title} from './components/Title';
import {Text} from './components/Text';

interface Props {
  verifyUrl: string;
}

export default function VerifyEmail({
  verifyUrl = 'https://www.wannago.app',
}: Props) {
  return (
    <Html>
      <Head />
      <Section style={main}>
        <Container style={container}>
          <Header />
          <Section>
            <Title>{`Verify your email`}</Title>
            <Text>{`If you think this email is received by mistake please let us know.`}</Text>
          </Section>
          <Section style={buttonContainer}>
            <Button href={verifyUrl}>{`Verify`}</Button>
          </Section>
          <Footer />
        </Container>
      </Section>
    </Html>
  );
}
