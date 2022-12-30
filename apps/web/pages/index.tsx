import Head from 'next/head';
import {Hero} from '../components/Marketing/Hero';
import {CallToAction} from '../components/Marketing/CallToAction';
import {Faqs} from '../components/Marketing/Faqs';
import {Footer} from '../components/Marketing/Footer';
import AppLayout from '../components/AppLayout/AppLayout';
import {Features} from '../components/Marketing/Features';

export default function HomePage() {
  return (
    <AppLayout>
      <Head>
        <title>WannaGo</title>
      </Head>
      <Hero />
      <div className="h-0.5 bg-slate-800" />
      {/* <PrimaryFeatures /> */}
      <Features />
      <div className="h-0.5 bg-slate-800" />
      {/* <SecondaryFeatures /> */}
      <CallToAction />
      <div className="h-0.5 bg-slate-800" />
      {/* <Testimonials /> */}
      {/* <Pricing /> */}
      <Faqs />
      <div className="h-0.5 bg-slate-800" />
      <Footer />
    </AppLayout>
  );
}
