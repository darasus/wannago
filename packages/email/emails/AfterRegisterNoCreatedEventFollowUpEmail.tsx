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
