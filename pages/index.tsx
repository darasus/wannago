import Head from 'next/head';
import {Hero} from '../components/Marketing/Hero';
import {PrimaryFeatures} from '../components/Marketing/PrimaryFeatures';
import {CallToAction} from '../components/Marketing/CallToAction';
import {Faqs} from '../components/Marketing/Faqs';
import {Footer} from '../components/Marketing/Footer';
import {GetServerSidePropsContext} from 'next';
import {buildClerkProps, clerkClient, getAuth} from '@clerk/nextjs/server';
import AppLayout from '../components/AppLayout/AppLayout';

export default function HomePage() {
  return (
    <AppLayout>
      <Head>
        <title>WannaGo</title>
      </Head>
      <Hero />
      <PrimaryFeatures />
      {/* <SecondaryFeatures /> */}
      <CallToAction />
      {/* <Testimonials /> */}
      {/* <Pricing /> */}
      <Faqs />
      <Footer />
    </AppLayout>
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
