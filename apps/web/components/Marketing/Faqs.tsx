import {FeedbackFish} from '@feedback-fish/react';
import {useState} from 'react';
import {Button} from 'ui';
import {Container} from '../Container/Container';
import {Accordion} from './Accordion';
import {SectionHeader} from './SectionHeader';
import {SectionContainer} from './SectionContainer';

const faqs = [
  {
    question: 'How do I create event page?',
    answer: (
      <span>
        After creating account on wannago.app, simply go to{' '}
        <Button variant="link" as="a" href="/dashboard">
          wannago.app/dashboard
        </Button>{' '}
        and click on the &quot;+&quot; button. Then enter the details of your
        event, including the date, time, location, and any other relevant
        information.
      </span>
    ),
  },
  {
    question: 'Can I customize event page visuals?',
    answer: `Unfortunately right now it is not possible to customize the visuals of your event page but we're planning to add that feature in the future.`,
  },
  {
    question: 'How do I invite people to my event?',
    answer: `You can invite people to your event either by sending them email invitation through attendees section or by sharing a public link to your event page by any means like WhatsApp or Twitter.`,
  },
  {
    question: 'Can my guests RSVP on my event page?',
    answer: `Yes, your guests can RSVP on your event page by filling in name, email address and clicking on "Join" button.`,
  },
  {
    question: 'Can I see who is coming to my event?',
    answer: `Yes, you can see who is coming to your event by viewing the list of attendees on your event page. You can also export a list of attendees as csv file.`,
  },
  {
    question: 'Is there a limit to the number of guests I can invite?',
    answer: `Currently there is no limit on the number of guests you can invite to your event.`,
  },
  {
    question: 'Can I add multiple events?',
    answer: `Currently there is not limit to how many events you can create.`,
  },
  {
    question: 'Is WannaGo completely free?',
    answer: `Yes. WannaGo is completely free to use right now but we're planning on adding premium features in the future.`,
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

export function Faqs() {
  const [isExpanded, setIsExpanded] = useState<false | number>(false);

  return (
    <SectionContainer id="faq" className="bg-white">
      <Container className="grid md:grid-cols-2 items-center gap-x-8 relative my-0">
        <SectionHeader
          title="FAQs"
          description={
            <>
              {"If you can't find what you're looking for, send us a "}
              <FeedbackFish projectId="f843146d960b2f">
                <Button variant="link" className="text-xl">
                  feedback
                </Button>
              </FeedbackFish>
              {" and we'll try to respond as soon as possible."}
            </>
          }
        />
        <div className="max-w-xl m-auto">
          {faqs.map((item, index) => {
            return (
              <Accordion
                key={index}
                index={index}
                title={item.question}
                content={item.answer}
                setExpanded={setIsExpanded}
                isExpanded={isExpanded}
              />
            );
          })}
        </div>
      </Container>
    </SectionContainer>
  );
}
