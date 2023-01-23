import {render} from '@react-email/render';
import {TRPCError} from '@trpc/server';
import {prisma} from 'database';
import {EventSignUp} from 'email';
import {NextApiRequest, NextApiResponse} from 'next';
import {z} from 'zod';
import {EmailType} from '../../lib/mailQueue';
import {Postmark} from '../../lib/portmark';
import {formatDate} from '../../utils/formatDate';
import {getBaseUrl} from '../../utils/getBaseUrl';

const postmark = new Postmark();

export const baseEventHandlerSchema = z
  .object({
    type: z.nativeEnum(EmailType),
  })
  .passthrough();

export const sendEventSignUpEmailSchema = baseEventHandlerSchema.extend({
  eventId: z.string().uuid(),
  userId: z.string().uuid(),
});

export const sendEventInviteEmailSchema = baseEventHandlerSchema.extend({
  eventId: z.string().uuid(),
  userId: z.string().uuid(),
});

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const input = baseEventHandlerSchema.parse(req.body);

  if (input.type === EmailType.EventSignUp) {
    const {eventId, userId} = sendEventSignUpEmailSchema.parse(input);

    const event = await prisma.event.findUnique({
      where: {id: eventId},
      include: {
        organization: {
          include: {
            users: true,
          },
        },
      },
    });

    const user = await prisma.user.findUnique({
      where: {id: userId},
    });

    if (!event || !user) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Event or user not found',
      });
    }

    const organizerUser = event.organization?.users[0];

    if (!organizerUser) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Organizer user not found',
      });
    }

    await postmark.sendTransactionalEmail({
      from: 'WannaGo Team <hi@wannago.app>',
      to: user.email,
      subject: `Thanks for signing up for "${event.title}"!`,
      htmlString: render(
        <EventSignUp
          title={event.title}
          address={event.address}
          eventUrl={`${getBaseUrl()}/e/${event.shortId}`}
          startDate={formatDate(event.startDate, 'MMMM d, yyyy')}
          endDate={formatDate(event.endDate, 'MMMM d, yyyy')}
          organizerName={`${organizerUser.firstName} ${organizerUser.lastName}`}
        />
      ),
    });
  }

  return res.status(200).json({success: true});
}
