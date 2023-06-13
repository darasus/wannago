import {Container} from '@react-email/container';
import {Head} from '@react-email/head';
import {Html} from '@react-email/html';
import {Section} from './components/Section';
import * as React from 'react';
import {Footer} from './components/Footer';
import {Header} from './components/Header';
import {Link} from './components/Link';
import {container, main, gutter} from './components/shared';
import {Text} from './components/Text';
import {Title} from './components/Title';

interface Props {
  firstName: string;
}

export default function AfterRegisterNoCreatedEventFollowUpEmail({
  firstName = 'Ilya',
}: Props) {
  return (
    <Html>
      <Head />
      <Section style={main}>
        <Container style={container}>
          <Header />
          <Section>
            <Title>{`Hey ${firstName}!`}</Title>
          </Section>
          <Section style={{marginBottom: gutter}}>
            <Text>{`We appreciate your interest in WannaGo!`}</Text>
          </Section>
          <Section style={{marginBottom: gutter}}>
            <Text>{`We've noticed that you still need to create an event. We would love to hear how we could improve our platform to meet your needs better.`}</Text>
          </Section>
          <Section style={{marginBottom: gutter}}>
            <Text>{`Please reply to this email if you have any feedback, suggestions, or concerns.`}</Text>
          </Section>
          <Section style={{marginBottom: gutter}}>
            <Text>
              {`Also, check our`}{' '}
              <Link href="https://www.wannago.app/#faq">FAQs</Link>
              {`. We might have already answered your question there.`}
            </Text>
          </Section>
          <Footer />
        </Container>
      </Section>
    </Html>
  );
}
