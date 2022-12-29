import {NextApiRequest, NextApiResponse} from 'next';
import {z} from 'zod';
import {Mailgun} from '../../../lib/mailgun';

const scheme = z.object({
  type: z.enum(['email.created']),
  data: z.object({
    subject: z.string(),
    to_email_address: z.string(),
    data: z.object({
      otp_code: z.string(),
    }),
  }),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(405).json({error: 'Method Not Allowed'});
  }

  const {data, type} = scheme.parse(req.body);

  if (type === 'email.created') {
    const mailgun = new Mailgun();

    await mailgun.sendLoginCodeEmail({
      code: data.data.otp_code,
      email: data.to_email_address,
      subject: data.subject,
    });
  }

  return res.status(200).json({success: true});
}
