import {EmailType} from '@prisma/client';
import {prisma} from 'database';
import {NextApiRequest, NextApiResponse} from 'next';
import {keys} from 'ramda';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const users = await prisma.user.findMany();

  await Promise.all(
    users.map(user => {
      return prisma.emailPreference.createMany({
        data: keys(EmailType).map(type => {
          return {
            emailType: type,
            userId: user.id,
          };
        }),
      });
    })
  );

  return res.status(200).json({success: true});
}
