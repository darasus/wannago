'use client';

import {useState} from 'react';
import {Button, Card, CardContent, CardHeader, CardTitle} from 'ui';
import {Container} from 'ui';
import {SectionHeader} from './SectionHeader';
import {SectionContainer} from './SectionContainer';
import Link from 'next/link';
import {cn, formatCents, formatPercent} from 'utils';
import {AnimatePresence, motion} from 'framer-motion';
import {feeAmount, feePercent} from 'const';

const faqs = [
  {
    question: 'How do I create event page?',
    answer: (
      <span>
        After creating account on wannago.app, simply go to{' '}
        <Link className="underline" href="/events">
          wannago.app/events
        </Link>{' '}
        {`and click on the "+ Create event" button. Then enter the details of your
        event, including the date, time, location, and any other relevant
        information.`}
      </span>
    ),
  },
  {
    question: 'Can I customize event page visuals?',
    answer: `Unfortunately right now it is not possible to customize the visuals of your event page but we're planning to add that feature in the future.`,
  },
  {
    question: 'What are the accepted currencies on WannaGo?',
    answer: `At present, our platform accommodates transactions exclusively in three key currencies: the US Dollar, the British Pound, and the Euro.`,
  },
  {
    question: 'In which countries is ticket selling permitted through WannaGo?',
    answer: `Currently, our platform facilitates ticket sales within three countries only: the United States of America, Great Britain, and the Netherlands.`,
  },
  {
    question: 'How much is the fee per sold ticket?',
    answer: `We charge ${formatCents(feeAmount, 'USD')} + ${formatPercent(
      feePercent
    )} fee for every ticket sold.`,
  },
  {
    question: 'How do I invite people to my event?',
    answer: `You can invite people to your event either by sending them email invitation through attendees section or by sharing a public link to your event page by any means like WhatsApp or Twitter.`,
  },
  {
    question: 'Can my guests RSVP on my event page?',
    answer: `Yes, your guests can RSVP on your event page by simply pressing on "Join" button.`,
  },
  {
    question: 'Can I see who is coming to my event?',
    answer: `Yes, you can see who is coming to your event by viewing the list of attendees on your event page. You can also export a list of attendees as csv file.`,
  },
  {
    question: 'Is there a limit to the number of guests I can invite?',
    answer: `Yes there is a limit on the number of guests you can invite to your event, please see pricing for more details.`,
  },
  {
    question: 'Can I add multiple events?',
    answer: `Yes there is  limit to how many events you can create for free, please see pricing for more details.`,
  },
  {
    question: 'Is WannaGo completely free?',
    answer: `Yes. WannaGo is completely free to use but there are limitations you should be aware of, please see pricing for more details.`,
  },
  {
    question: 'Can I add photos and videos to my event page?',
    answer: `Currently you can add only one featured photo to your event page.`,
  },
  {
    question: 'Can I add a map to my event page?',
    answer: `Yes, you can add a map to your event page by entering the address of your event, map with correct location will automatically show up on your event page.`,
  },
  {
    question: 'Can I add a description to my event?',
    answer: `Yes, you can add rich text description to your event with a simple text editor in the event form.`,
  },
  {
    question: `Can I add a schedule or agenda to my event page?`,
    answer: `Currently it is possible to add agenda in the description field but we're working on a more dedicated way of creating agendas.`,
  },
  {
    question: 'Can I add a list of attendees to my event page?',
    answer:
      'Currently it is not possible for your visitors to view a list of all attendees.',
  },
  {
    question: 'Can I add links to my event page?',
    answer: `Yes, it is possible to add links in the description of your event.`,
  },
  {
    question: 'Can I add a contact form to my event page?',
    answer: `Yes, all event pages have a contact form.`,
  },
  {
    question: 'Can I add a password to my event page?',
    answer: 'No, currently we do not support password protected events.',
  },
];

interface ItemProps {
  faq: {question: string; answer: JSX.Element | string};
  isOpen: boolean;
  toggle: () => void;
}

function Item({faq, isOpen, toggle}: ItemProps) {
  return (
    <div onClick={toggle}>
      <Card className={cn('overflow-hidden cursor-pointer')}>
        <CardHeader>
          <CardTitle>{faq.question}</CardTitle>
        </CardHeader>
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.section
              key="content"
              initial="collapsed"
              animate="open"
              exit="collapsed"
              variants={{
                open: {opacity: 1, height: 'auto'},
                collapsed: {opacity: 0, height: 0},
              }}
              transition={{duration: 0.8, ease: [0.04, 0.62, 0.23, 0.98]}}
            >
              <CardContent>{faq.answer}</CardContent>
            </motion.section>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
}

export function Faqs() {
  const [expanded, setIsExpanded] = useState<false | number>(false);

  return (
    <SectionContainer id="faq">
      <Container>
        <SectionHeader
          title="FAQs"
          description={
            <>
              {`If you can't find what you're looking for, send us a `}{' '}
              <Button
                className="text-md p-0 underline"
                variant="link"
                onClick={() => {
                  (window as any)?.MissiveChat?.open();
                }}
              >
                feedback
              </Button>{' '}
              {`and we'll try to respond as soon as possible.`}
            </>
          }
        />
        <div className="grid grid-cols-1 gap-2">
          {faqs.map((item, index) => {
            return (
              <Item
                key={index}
                faq={item}
                isOpen={expanded === index}
                toggle={() => setIsExpanded(index)}
              />
            );
          })}
        </div>
      </Container>
    </SectionContainer>
  );
}
