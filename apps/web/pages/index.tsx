import Head from 'next/head';
import {Hero} from '../components/Marketing/Hero';
import {CallToAction} from '../components/Marketing/CallToAction';
import {Faqs} from '../components/Marketing/Faqs';
import {Footer} from '../components/Marketing/Footer';
import AppLayout from '../components/AppLayout/AppLayout';
import {Features} from '../components/Marketing/Features';
import {useAnimateStars} from '../utils/animateStars';
import {useLayoutEffect, useRef, useState} from 'react';

export default function HomePage() {
  const el = useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = useState(0);

  useAnimateStars();

  useLayoutEffect(() => {
    if (el.current) {
      setHeight(el.current.getBoundingClientRect().bottom);
    }
  }, []);

  return (
    <AppLayout>
      <Head>
        <title>WannaGo</title>
      </Head>
      <canvas className="absolute top-0 left-0 w-full z-0" style={{height}} />
      <Hero ref={el} />
      <div className="h-0.5 bg-gray-700" />
      {/* <PrimaryFeatures /> */}
      <Features />
      <div className="h-0.5 bg-gray-700" />
      {/* <SecondaryFeatures /> */}
      <CallToAction />
      <div className="h-0.5 bg-gray-700" />
      {/* <Testimonials /> */}
      {/* <Pricing /> */}
      <Faqs />
      <div className="h-0.5 bg-gray-700" />
      <Footer />
    </AppLayout>
  );
}
