import Head from 'next/head';
import {Hero} from '../components/Marketing/Hero';
import {CallToAction} from '../components/Marketing/CallToAction';
import {Faqs} from '../components/Marketing/Faqs';
import {Footer} from '../components/Marketing/Footer';
import AppLayout from '../features/AppLayout/AppLayout';
import {Features} from '../components/Marketing/Features';
import {useFeatureFlag} from 'hooks';

export default function HomePage() {
  const {isEnabled} = useFeatureFlag({feature: 'test_feature'});

  console.log({isEnabled});

  console.log('hi');

  return (
    <AppLayout>
      <Head>
        <title>WannaGo</title>
      </Head>
      <Hero />
      <div className="h-0.5 bg-gray-800" />
      {/* <PrimaryFeatures /> */}
      <Features />
      <div className="h-0.5 bg-gray-800" />
      {/* <SecondaryFeatures /> */}
      <CallToAction />
      <div className="h-0.5 bg-gray-800" />
      {/* <Testimonials /> */}
      {/* <Pricing /> */}
      <Faqs />
      <div className="h-0.5 bg-gray-800" />
      <Footer />
    </AppLayout>
  );
}
