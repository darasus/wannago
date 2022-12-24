import Head from 'next/head';
import {Hero} from '../components/Marketing/Hero';
import {CallToAction} from '../components/Marketing/CallToAction';
import {Faqs} from '../components/Marketing/Faqs';
import {Footer} from '../components/Marketing/Footer';
import AppLayout from '../components/AppLayout/AppLayout';
import {Features} from '../components/Marketing/Features';
import {useLayoutEffect, useRef, useState} from 'react';
import {CircleBackground} from '../components/Marketing/CircleBackground';
import {motion} from 'framer-motion';

export default function HomePage() {
  const el = useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = useState(0);

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
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 flex justify-center items-center overflow-hidden"
        style={{height, width: '100%'}}
      >
        <motion.div
          style={{transformOrigin: 'center'}}
          initial={{rotate: 0}}
          animate={{rotate: 360}}
          transition={{
            repeat: Infinity,
            duration: 5,
            repeatType: 'loop',
            ease: 'linear',
          }}
        >
          <CircleBackground height={height * 0.7} width={height * 0.7} />
        </motion.div>
      </div>
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
