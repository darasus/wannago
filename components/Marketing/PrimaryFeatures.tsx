import {useEffect, useState} from 'react';
import Image from 'next/image';
import {Tab} from '@headlessui/react';
import clsx from 'clsx';
import {Container} from './Container';

const features = [
  {
    title: 'Create event page with ease',
    description:
      'With WannaGo, you can quickly and easily create a shareable event page and customize it with all the details your guests need to know.',
    image: '/images/screenshots/event-page.png',
  },
  {
    title: 'Invite only the guests you want',
    description:
      "Our platform allows you to invite only the people you want to attend your event, ensuring that it stays private, whether it's your friends, family or twitter following.",
    image: '/images/screenshots/event-page.png',
  },
  {
    title: 'Customizable event pages',
    description:
      'You can upload photo, add details about the date, time, and location of your event, and even include information about the dress code or any special instructions',
    image: '/images/screenshots/edit-page.png',
  },
  {
    title: 'Easy communication with guests',
    description:
      "Send reminders and messages to your guests to make sure they don't miss out on your event.",
    image: '/images/screenshots/event-page.png',
  },
  {
    title: 'RSVP tracking',
    description:
      'Keep track of who is attending your event with our easy-to-use RSVP system. You can see at a glance who has confirmed their attendance and who is still on the fence.',
    image: '/images/screenshots/event-page.png',
  },
];

export function PrimaryFeatures() {
  let [tabOrientation, setTabOrientation] = useState('horizontal');

  useEffect(() => {
    let lgMediaQuery = window.matchMedia('(min-width: 1024px)');

    function onMediaQueryChange({matches}: any) {
      setTabOrientation(matches ? 'vertical' : 'horizontal');
    }

    onMediaQueryChange(lgMediaQuery);
    lgMediaQuery.addEventListener('change', onMediaQueryChange);

    return () => {
      lgMediaQuery.removeEventListener('change', onMediaQueryChange);
    };
  }, []);

  return (
    <section
      id="features"
      aria-label="Features for running your books"
      className="relative overflow-hidden bg-gray-800 pt-20 pb-28 sm:py-32"
    >
      <Container className="relative">
        <div className="max-w-2xl md:mx-auto text-center xl:max-w-none">
          <h2 className="font-bold text-3xl tracking-tight text-brand-200 sm:text-4xl md:text-5xl">
            Easiest way to invite your network to your place
          </h2>
          <p className="mt-6 text-lg tracking-tight text-gray-100">
            All you need to do is welcome your guests and we will take care of
            the rest.
          </p>
        </div>
        <Tab.Group
          as="div"
          className="mt-16 grid grid-cols-1 items-center gap-y-2 pt-10 sm:gap-y-6 md:mt-20 lg:grid-cols-12 lg:pt-0"
          vertical={tabOrientation === 'vertical'}
        >
          {({selectedIndex}) => (
            <>
              <div className="-mx-4 flex overflow-x-auto pb-4 sm:mx-0 sm:overflow-visible sm:pb-0 lg:col-span-5">
                <Tab.List className="relative z-10 flex gap-x-4 whitespace-nowrap px-4 sm:mx-auto sm:px-0 lg:mx-0 lg:block lg:gap-x-0 lg:gap-y-1 lg:whitespace-normal">
                  {features.map((feature, featureIndex) => (
                    <div
                      key={feature.title}
                      className={clsx(
                        'group relative rounded-md py-1 px-4 lg:rounded-r-none lg:rounded-l-xl lg:p-4',
                        selectedIndex === featureIndex
                          ? 'bg-white lg:bg-white/10 lg:ring-1 lg:ring-inset lg:ring-white/10'
                          : 'hover:bg-white/10 lg:hover:bg-white/5'
                      )}
                    >
                      <h3>
                        <Tab
                          className={clsx(
                            'font-display text-mg outline-none',
                            selectedIndex === featureIndex
                              ? 'text-gray-800 lg:text-white'
                              : 'text-blue-100 hover:text-white lg:text-white'
                          )}
                        >
                          <span className="absolute inset-0 rounded-full lg:rounded-r-none lg:rounded-l-xl" />
                          {feature.title}
                        </Tab>
                      </h3>
                      <p
                        className={clsx(
                          'mt-2 hidden text-xs lg:block',
                          selectedIndex === featureIndex
                            ? 'text-white'
                            : 'text-blue-100 group-hover:text-white'
                        )}
                      >
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </Tab.List>
              </div>
              <Tab.Panels className="lg:col-span-7">
                {features.map(feature => (
                  <Tab.Panel key={feature.title} unmount={false}>
                    <div className="relative sm:px-6 lg:hidden">
                      <div className="absolute -inset-x-4 top-[-6.5rem] bottom-[-4.25rem] bg-white/10 ring-1 ring-inset ring-white/10 sm:inset-x-0 sm:rounded-t-xl" />
                      <p className="relative mx-auto max-w-2xl text-base text-white sm:text-center">
                        {feature.description}
                      </p>
                    </div>
                    <div className="mt-10 w-[45rem] overflow-hidden rounded-xl bg-slate-50 shadow-xl shadow-blue-900/20 sm:w-auto lg:mt-0 lg:w-[67.8125rem]">
                      <div className="flex items-center px-3 py-2 border-b">
                        <div className="flex gap-x-1">
                          <div className="h-2 w-2 bg-red-400 rounded-full" />
                          <div className="h-2 w-2 bg-yellow-400 rounded-full" />
                          <div className="h-2 w-2 bg-green-400 rounded-full" />
                        </div>
                        <div className="flex grow justify-center">
                          <div className="flex items-center border border-gray-200 px-3 h-5 rounded-md bg-gray-100">
                            <span className="text-xs text-gray-400 leading-none">
                              wannago.app
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="relative overflow-hidden aspect-video">
                        <Image
                          style={{
                            objectFit: 'cover',
                            objectPosition: 'top',
                          }}
                          className="w-full"
                          src={feature.image}
                          alt=""
                          priority
                          fill
                          sizes="(min-width: 1024px) 67.8125rem, (min-width: 640px) 100vw, 45rem"
                        />
                      </div>
                    </div>
                  </Tab.Panel>
                ))}
              </Tab.Panels>
            </>
          )}
        </Tab.Group>
      </Container>
    </section>
  );
}
