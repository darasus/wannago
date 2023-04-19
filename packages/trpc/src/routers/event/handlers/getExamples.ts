import {publicProcedure} from '../../../trpcServer';

export const getExamples = publicProcedure.query(({ctx}) => {
  return ctx.prisma.event.findMany({
    where: {
      isPublished: true,
      user: {
        email: {
          in: ['idarase+clerk_test@gmail.com', 'hi+example@wannago.app'],
        },
      },
    },
    include: {
      user: true,
      organization: true,
    },
  });
});
