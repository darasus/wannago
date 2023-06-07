import {EmailType} from 'types';
import {canCreateReminder, createDelay} from 'utils';
import {z} from 'zod';
import {ActionContext} from '../context';

const validation = z.object({
  eventId: z.string(),
  startDate: z.date(),
});

export function createEventReminder(ctx: ActionContext) {
  return async (input: z.infer<typeof validation>) => {
    const {eventId, startDate} = validation.parse(input);

    let messageId: string | null = null;

    if (canCreateReminder(startDate, ctx.timezone)) {
      const message = await ctx.mailQueue.addMessage({
        body: {
          eventId,
          startDate,
          type: EmailType.EventReminder,
        },
        delay: createDelay({startDate}),
      });

      messageId = message?.messageId || null;
    }

    return {messageId};
  };
}
