import {getAuth} from '@clerk/nextjs/server';
import {NextApiRequest, NextApiResponse} from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {userId} = getAuth(req);
  // await prisma.user.findFirst({
  //   where: {
  //     email: title,
  //   },
  // });
  res.status(200).json({userId});
}
