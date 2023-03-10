import {Container, PageHeader, Text} from 'ui';
import {cn} from 'utils';
import AppLayout from '../features/AppLayout/AppLayout';
import {titleFontClassName} from '../fonts';

export default function TermsPage() {
  return (
    <AppLayout>
      <Container>
        <PageHeader className="mb-4" title="Terms and Conditions of Use" />
        <ul className="flex flex-col gap-y-4 list-inside list-decimal">
          <li>
            <Text>
              {`Introduction Welcome to WannaGo! These Terms and Conditions
        of Use ("Terms") govern your access to and use of our web application
        and any related services (collectively, the "Services"). By using our
        Services, you agree to be bound by these Terms. If you do not agree to
        these Terms, do not use our Services.`}
            </Text>
          </li>
          <li>
            <Text>
              Description of Services Our Services allow users to create and
              manage events, invite guests, and communicate with their network.
              We provide tools to help users organize and plan their events, as
              well as features to help them stay connected with their guests.
            </Text>
          </li>
          <li>
            <Text>
              User Accounts In order to use our Services, you must create a user
              account. You are responsible for maintaining the security of your
              account and keeping your login information confidential. You are
              also responsible for all activities that occur under your account.
              If you become aware of any unauthorized use of your account,
              please notify us immediately.
            </Text>
          </li>
          <li>
            <Text>
              {`User Content You retain ownership of any content that you upload or
        submit to our Services ("User Content"). By uploading or submitting User
        Content, you grant us a non-exclusive, royalty-free, worldwide license
        to use, copy, modify, distribute, and display your User Content in
        connection with our Services. You represent and warrant that you have
        all necessary rights to grant this license and that your User Content
        does not infringe on the rights of any third party.`}
            </Text>
          </li>
          <li>
            <Text>
              Prohibited Conduct You may not use our Services to engage in any
              illegal, fraudulent, or abusive activity. You may not upload or
              submit any content that is obscene, offensive, or harmful to
              others. You may not use our Services in a manner that interferes
              with the operation of our platform or harms our reputation.
            </Text>
          </li>
          <li>
            <Text>
              Privacy Policy We take your privacy seriously. Our Privacy Policy
              outlines how we collect, use, and protect your personal
              information. By using our Services, you agree to the terms of our
              Privacy Policy.
            </Text>
          </li>
          <li>
            <Text>
              Disclaimer of Warranties We make no warranties or representations
              about the accuracy or completeness of our Services. We do not
              guarantee that our Services will be error-free or uninterrupted.
              You use our Services at your own risk.
            </Text>
          </li>
          <li>
            <Text>
              Limitation of Liability We are not liable for any damages arising
              from your use of our Services. In no event shall we be liable for
              any indirect, incidental, special, or consequential damages
              arising out of or in connection with your use of our Services.
            </Text>
          </li>
          <li>
            <Text>
              Indemnification You agree to indemnify and hold us harmless from
              any claims, damages, or expenses arising out of your use of our
              Services or your violation of these Terms.
            </Text>
          </li>
          <li>
            <Text>
              Termination We may terminate your access to our Services at any
              time for any reason. Upon termination, your user account and all
              User Content will be deleted from our platform.
            </Text>
          </li>
          <li>
            <Text>
              Governing Law These Terms shall be governed by and construed in
              accordance with the laws of The Netherlands.
            </Text>
          </li>
          <li>
            <Text>
              Changes to Terms and Conditions We reserve the right to modify
              these Terms at any time. Any changes will be posted to our
              website, and your continued use of our Services after such changes
              will constitute your acceptance of the modified Terms.
            </Text>
          </li>
          <li>
            <Text>
              Contact Us If you have any questions or concerns about these Terms
              or our Services, please contact us at hi @ wannago.app.
            </Text>
          </li>
        </ul>
      </Container>
    </AppLayout>
  );
}
