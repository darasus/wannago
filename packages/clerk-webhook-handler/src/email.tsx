import {emailCreateScheme, baseScheme} from './validation';
import {Postmark} from 'lib';
import {render} from '@react-email/render';
import {LoginCode} from 'email';
import {z} from 'zod';

const postmark = new Postmark();

export const handleEmailCreate = async (input: z.infer<typeof baseScheme>) => {
  const {data} = emailCreateScheme.parse(input);

  await postmark.sendToTransactionalStream({
    to: data.to_email_address,
    subject: data.subject,
    htmlString: render(<LoginCode code={data.data.otp_code} />),
  });
};
