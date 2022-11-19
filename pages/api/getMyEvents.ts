import {getAuth} from '@clerk/nextjs/server';
import {NextApiRequest, NextApiResponse} from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({error: 'Method Not Allowed'});
  }

  const {userId} = getAuth(req);
  // await prisma.user.findFirst({
  //   where: {
  //     email: title,
  //   },
  // });
  res.status(200).json({userId});
}
