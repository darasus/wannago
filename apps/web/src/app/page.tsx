import {Hero} from '../components/Marketing/Hero';
import {CallToAction} from '../components/Marketing/CallToAction';
import {Faqs} from '../components/Marketing/Faqs';
import {Footer} from '../components/Marketing/Footer';
import {Features} from '../components/Marketing/Features';
import {HowDoesItWork} from '../components/Marketing/HowDoesItWork';
import {Pricing} from '../components/Marketing/Pricing';

export default function HomePage() {
  return (
    <>
      <Hero />
      <div className="h-0.5 bg-gray-800" />
      <HowDoesItWork />
      <div className="h-0.5 bg-gray-800" />
      <Features />
      <div className="h-0.5 bg-gray-800" />
      {/* <SecondaryFeatures /> */}
      <Pricing />
      <div className="h-0.5 bg-gray-800" />
      {/* <Testimonials /> */}
      <CallToAction />
      <div className="h-0.5 bg-gray-800" />
      <Faqs />
      <div className="h-0.5 bg-gray-800" />
      <Footer />
    </>
  );
}
