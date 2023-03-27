import {captureException} from '@sentry/nextjs';
import {handleEventReminderEmailInputSchema} from 'email-input-validation';
import {EmailType} from 'types';
import {canCreateReminder, createDelay, invariant} from 'utils';
import {z} from 'zod';
import {ActionContext} from '../context';

const validation = z.object({
  eventId: z.string(),
  startDate: z.date(),
  oldMessageId: z.string().nullable().optional(),
});

export function updateEventReminder(ctx: ActionContext) {
  return async (input: z.infer<typeof validation>) => {
    const {eventId, startDate, oldMessageId} = validation.parse(input);

    let messageId: string | null = null;

    try {
      if (oldMessageId) {
        await ctx.mailQueue.removeMessage({
          messageId: oldMessageId,
        });
      }

      if (startDate && canCreateReminder(startDate, ctx.timezone)) {
        const message = await ctx.mailQueue.addMessage({
          body: {
            eventId,
            startDate: startDate,
            type: EmailType.EventReminder,
          } satisfies z.infer<typeof handleEventReminderEmailInputSchema>,
          delay: createDelay({startDate: startDate}),
        });

        messageId = message?.messageId || null;
      }
    } catch (error) {
      captureException(error);
    }

    return {messageId};
  };
}
