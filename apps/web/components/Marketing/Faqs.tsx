import {FeedbackFish} from '@feedback-fish/react';
import {useState} from 'react';
import {Button} from '../Button/Button';
import {CardBase} from '../Card/CardBase/CardBase';
import {Container} from '../Container/Container';
import {Accordion} from './Accordion';
import {SecionHeader} from './SecionHeader';
import {SectionContainer} from './SectionContainer';

const faqs = [
  {
    question: 'How do I create an event page?',
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
    question: 'Can I customize my event page?',
    answer: `Unfortunately right now it is not possible to customize the visuals of your event page.`,
  },
  {
    question: 'How do I share my event page with others?',
    answer: `To share your event page with others, simply copy the link to your event page (in the green box) and share it via email, social media, or any other platform you prefer.`,
  },
  {
    question: 'Can my guests RSVP on my event page?',
    answer: `Yes, your guests can RSVP on your event page by filing in email address and clicking on the "Join" button.`,
  },
  {
    question: 'Can I see who is coming to my event?',
    answer: `Yes, you can see who is coming to your event by viewing the list of attendees on your event page.`,
  },
  {
    question: 'Is there a limit to the number of guests I can invite?',
    answer: `There is no limit to the number of guests you can invite to your event.`,
  },
  {
    question: 'Can I add multiple events?',
    answer: `There is not limit in how many events you can create.`,
  },
  {
    question: 'Is there a cost to use EventPage?',
    answer: `No, WannaGo is completely free to use right now but we're planning to add extra paid features in the future.`,
  },
  {
    question: 'Can I add photos and videos to my event page?',
    answer: `Currently you can add only one photo to your event page.`,
  },
  {
    question: 'Can I add a map to my event page?',
    answer: `Yes, you can add a map to your event page by entering the address of your event, map with correct location will automatically show up on yout event page.`,
  },
  {
    question: 'Can I add a description to my event?',
    answer: `Yes, you can add rich description to your event with a simple text editor on the event form.`,
  },
  {
    question: `Can I add a schedule or agenda to my event page?`,
    answer: `Currently it is possible in the description field but we're working on a more advanced way of defining your agenda.`,
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
    answer: `Yes, you can ask a question by clicking on "Have questions?" in the organizer section on the event page.`,
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
        <SecionHeader
          title="Frequently asked questions"
          description={
            <>
              {"If you can't find what you're looking for, send us a "}
              <FeedbackFish projectId="f843146d960b2f">
                <Button variant="link" className="text-xl">
                  Feedback
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
