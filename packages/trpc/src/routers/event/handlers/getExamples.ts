import {exampleEventIds} from 'const';
import {publicProcedure} from '../../../trpcServer';

export const getExamples = publicProcedure.query(({ctx}) => {
  return ctx.prisma.event.findMany({
    where: {
      isPublished: true,
      shortId: {
        in: exampleEventIds,
      },
    },
    include: {
      user: true,
      organization: true,
    },
  });
});
