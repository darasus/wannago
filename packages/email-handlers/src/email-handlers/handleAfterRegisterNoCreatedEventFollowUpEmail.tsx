import {render} from '@react-email/render';
import {TRPCError} from '@trpc/server';
import {prisma} from 'database';
import {Postmark} from 'lib';
import {z} from 'zod';
import {AfterRegisterNoCreatedEventFollowUpEmail} from 'email';
import {baseEventHandlerSchema} from '../validation/baseEventHandlerSchema';

const postmark = new Postmark();

export const handleAfterRegisterNoCreatedEventFollowUpEmailInputSchema =
  baseEventHandlerSchema.extend({
    userId: z.string().uuid(),
  });

export async function handleAfterRegisterNoCreatedEventFollowUpEmail({
  userId,
}: z.infer<typeof handleAfterRegisterNoCreatedEventFollowUpEmailInputSchema>) {
  const user = await prisma.user.findUnique({
    where: {id: userId},
  });

  if (!user) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'User not found',
    });
  }

  const eventCount = await prisma.event.count({
    where: {
      organizationId: user.organizationId,
    },
  });

  const hasNoEvents = eventCount === 0;

  if (hasNoEvents && user?.firstName) {
    await postmark.sendToBroadcastStream({
      replyTo: 'WannaGo Team <hi@wannago.app>',
      to: user.email,
      subject: 'We would love to hear your feedback',
      htmlString: render(
        <AfterRegisterNoCreatedEventFollowUpEmail firstName={user?.firstName} />
      ),
    });
  }
}
