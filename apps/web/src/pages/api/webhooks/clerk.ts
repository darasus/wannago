import {NextApiRequest, NextApiResponse} from 'next';
import {baseScheme, user, email} from 'clerk-webhook-handler';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(405).json({error: 'Method Not Allowed'});
  }

  const input = baseScheme.parse(req.body);

  if (input.type === 'user.created') {
    await user.created(input);
  }
  if (input.type === 'user.updated') {
    await user.updated(input);
  }
  if (input.type === 'user.deleted') {
    await user.deleted(input);
  }
  if (input.type === 'email.created') {
    await email.created(input);
  }

  return res.status(200).json({success: true});
}
