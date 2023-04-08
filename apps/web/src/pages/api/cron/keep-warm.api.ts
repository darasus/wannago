import type {NextApiResponse, NextApiRequest} from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await fetch('https://www.wannago.app/e/FyThYG');

  res.status(200).json({success: true});
}
