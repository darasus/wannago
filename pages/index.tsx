import Head from 'next/head';
import {Header} from '../components/Header/Header';
import {Hero} from '../components/Marketing/Hero';
import {PrimaryFeatures} from '../components/Marketing/PrimaryFeatures';
import {SecondaryFeatures} from '../components/Marketing/SecondaryFeatures';
import {CallToAction} from '../components/Marketing/CallToAction';
import {Testimonials} from '../components/Marketing/Testimonials';
import {Pricing} from '../components/Marketing/Pricing';
import {Faqs} from '../components/Marketing/Faqs';
import {Footer} from '../components/Marketing/Footer';
import {GetServerSidePropsContext} from 'next';
import {buildClerkProps, clerkClient, getAuth} from '@clerk/nextjs/server';

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

export async function getServerSideProps({
  req,
  res,
}: GetServerSidePropsContext) {
  const {userId} = getAuth(req);
  const user = userId ? await clerkClient.users.getUser(userId) : null;

  res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate=600');

  return {props: {...buildClerkProps(req, {user})}};
}
