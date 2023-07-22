import {Hero} from '../components/Marketing/Hero';
import {CallToAction} from '../components/Marketing/CallToAction';
import {Faqs} from '../components/Marketing/Faqs';
import {Footer} from '../components/Marketing/Footer';
import {Features} from '../components/Marketing/Features';
import {HowDoesItWork} from '../components/Marketing/HowDoesItWork';
import {Pricing} from '../components/Marketing/Pricing';

export const runtime = 'nodejs';
export const preferredRegion = 'iad1';

export default function HomePage() {
  return (
    <>
      <Hero />
      <div className="h-0.5 bg-secondary" />
      <HowDoesItWork />
      <div className="h-0.5 bg-secondary" />
      <Features />
      <div className="h-0.5 bg-secondary" />
      {/* <SecondaryFeatures /> */}
      <Pricing />
      <div className="h-0.5 bg-secondary" />
      {/* <Testimonials /> */}
      <CallToAction />
      <div className="h-0.5 bg-secondary" />
      <Faqs />
      <div className="h-0.5 bg-secondary" />
      <Footer />
    </>
  );
}
