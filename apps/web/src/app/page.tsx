import {Hero} from '../components/Marketing/Hero';
import {CallToAction} from '../components/Marketing/CallToAction';
import {Faqs} from '../components/Marketing/Faqs';
import {Footer} from '../components/Marketing/Footer';
import {Features} from '../components/Marketing/Features';
import {HowDoesItWork} from '../components/Marketing/HowDoesItWork';
import {Pricing} from '../components/Marketing/Pricing';

export const runtime = 'edge';
export const preferredRegion = 'iad1';

export default function HomePage() {
  return (
    <>
      <Hero />
      <div className="border-b" />
      <HowDoesItWork />
      <div className="border-b" />
      <Features />
      <div className="border-b" />
      {/* <SecondaryFeatures /> */}
      <Pricing />
      <div className="border-b" />
      {/* <Testimonials /> */}
      <CallToAction />
      <div className="border-b" />
      <Faqs />
      <div className="border-b" />
      <Footer />
    </>
  );
}
