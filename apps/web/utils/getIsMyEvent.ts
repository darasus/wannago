import {TRPCError} from '@trpc/server';
import {Context} from '../server/context';

export async function authorizeChange({
  ctx,
  eventId,
}: {
  ctx: Context;
  eventId: string;
}) {
  const user = await ctx.prisma.user.findFirst({
    where: {
      externalId: ctx.user?.id,
    },
    include: {
      organization: {
        include: {
          events: true,
        },
      },
    },
  });

  const isMyEvent = user?.organization?.events.some(
    event => event.id === eventId
  );

  if (!isMyEvent) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Not authorized',
    });
  }
}
