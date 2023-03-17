import {TRPCError} from '@trpc/server';
import {Context} from 'trpc';

export async function authorizeChange({
  ctx,
  eventId,
}: {
  ctx: Context;
  eventId: string;
}) {
  const user = await ctx.prisma.user.findFirst({
    where: {
      externalId: ctx.auth?.userId,
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

  const isAdmin = user?.type === 'ADMIN';

  if (!isMyEvent && !isAdmin) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Not authorized',
    });
  }
}
