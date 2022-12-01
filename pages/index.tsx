import Head from 'next/head';
import {Header} from '../components/Marketing/Header';
import {Hero} from '../components/Marketing/Hero';
import {PrimaryFeatures} from '../components/Marketing/PrimaryFeatures';
import {SecondaryFeatures} from '../components/Marketing/SecondaryFeatures';
import {CallToAction} from '../components/Marketing/CallToAction';
import {Testimonials} from '../components/Marketing/Testimonials';
import {Pricing} from '../components/Marketing/Pricing';
import {Faqs} from '../components/Marketing/Faqs';
import {Footer} from '../components/Marketing/Footer';

export default function HomePage() {
  return (
    <>
      <Head>
        <title>WannaGo</title>
      </Head>
      <Header />
      <main>
        <Hero />
        <PrimaryFeatures />
        {/* <SecondaryFeatures /> */}
        <CallToAction />
        {/* <Testimonials /> */}
        {/* <Pricing /> */}
        <Faqs />
      </main>
      <Footer />
    </>
  );
}
