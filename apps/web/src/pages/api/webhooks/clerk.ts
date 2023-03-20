import {NextApiRequest, NextApiResponse} from 'next';
import {
  baseScheme,
  handleEmailCreate,
  handleUserCreate,
  handleUserDelete,
  handleUserUpdate,
} from 'clerk-webhook-handler';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(405).json({error: 'Method Not Allowed'});
  }

  const input = baseScheme.parse(req.body);

  if (input.type === 'user.created') {
    await handleUserCreate(input);
  }
  if (input.type === 'user.updated') {
    await handleUserUpdate(input);
  }
  if (input.type === 'user.deleted') {
    await handleUserDelete(input);
  }
  if (input.type === 'email.created') {
    await handleEmailCreate(input);
  }

  return res.status(200).json({success: true});
}
