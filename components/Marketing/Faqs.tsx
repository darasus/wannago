import {Container} from './Container';

const faqs = [
  [
    {
      question: 'How do I create an event page?',
      answer:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ut nunc quam. ',
    },
    {
      question: 'Can I customize my event page?',
      answer:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ut nunc quam. ',
    },
    {
      question: 'How do I share my event page with others?',
      answer:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ut nunc quam. ',
    },
    {
      question: 'Can my guests RSVP on my event page?',
      answer:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ut nunc quam. ',
    },
    {
      question: 'Can I see who is coming to my event?',
      answer:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ut nunc quam. ',
    },
    {
      question: 'Is there a limit to the number of guests I can invite?',
      answer:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ut nunc quam. ',
    },
  ],
  [
    {
      question: 'Can I add multiple events to my event page?',
      answer:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ut nunc quam. ',
    },
    {
      question: 'Is there a cost to use EventPage?',
      answer:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ut nunc quam. ',
    },
    {
      question: 'Can I add photos to my event page?',
      answer:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ut nunc quam. ',
    },
    {
      question: 'Can I add a map to my event page?',
      answer:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ut nunc quam. ',
    },
    {
      question: 'Can I add a description to my event?',
      answer:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ut nunc quam. ',
    },
    {
      question: 'Can I add a schedule or agenda to my event page?',
      answer:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ut nunc quam. ',
    },
    {
      question: 'Can I add a list of attendees to my event page?',
      answer:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ut nunc quam. ',
    },
  ],
  [
    {
      question: 'Can I add links to my event page?',
      answer:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ut nunc quam. ',
    },
    {
      question: 'Can I add a contact form to my event page?',
      answer:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ut nunc quam. ',
    },
    {
      question: 'Can I add a social media feed to my event page?',
      answer:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ut nunc quam. ',
    },
    {
      question: 'Can I add a countdown to my event?',
      answer:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ut nunc quam. ',
    },
    {
      question: 'Can I add a password to my event page?',
      answer:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ut nunc quam. ',
    },
    {
      question: 'Can I add a theme to my event page?',
      answer:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ut nunc quam. ',
    },
    {
      question: 'Can I add a background image to my event page?',
      answer:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ut nunc quam. ',
    },
  ],
];

export function Faqs() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="relative overflow-hidden bg-gray-800 py-20 sm:py-32 px-4"
    >
      {/* <Image
        className="absolute top-0 left-1/2 max-w-none translate-x-[-30%] -translate-y-1/4"
        src={'/images/background-faqs.jpg'}
        alt=""
        width={1558}
        height={946}
        unoptimized
      /> */}
      <Container className="relative">
        <div className="mx-auto lg:mx-0 text-center">
          <h2
            id="faq-title"
            className="font-bold text-3xl tracking-tight text-brand-200 sm:text-4xl"
          >
            Frequently asked questions
          </h2>
          <p className="mt-4 text-lg tracking-tight text-slate-100">
            If you can’t find what you’re looking for, email our support team
            and if you’re lucky someone will get back to you.
          </p>
        </div>
        <ul
          role="list"
          className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3"
        >
          {faqs.map((column, columnIndex) => (
            <li key={columnIndex}>
              <ul role="list" className="flex flex-col gap-y-8">
                {column.map((faq, faqIndex) => (
                  <li key={faqIndex}>
                    <h3 className="font-bold text-lg text-slate-100 leading-5">
                      {faq.question}
                    </h3>
                    <p className="mt-4 text-sm text-slate-100">{faq.answer}</p>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
