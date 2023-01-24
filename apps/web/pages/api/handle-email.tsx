import {render} from '@react-email/render';
import {TRPCError} from '@trpc/server';
import {prisma} from 'database';
import {
  EventInvite,
  EventSignUp,
  MessageToAttendees,
  MessageToOrganizer,
} from 'email';
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

export const sendQuestionToOrganizerEmailSchema = baseEventHandlerSchema.extend(
  {
    eventId: z.string().uuid(),
    organizerEmail: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    subject: z.string(),
    message: z.string(),
  }
);

export const sendMessageToAllAttendeesEmailSchema =
  baseEventHandlerSchema.extend({
    subject: z.string(),
    message: z.string(),
    eventId: z.string().uuid(),
    organizerUserId: z.string().uuid(),
  });

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(405).json({error: 'Method Not Allowed'});
  }

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

  if (input.type === EmailType.EventInvite) {
    const {eventId, userId} = sendEventInviteEmailSchema.parse(input);

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

    const url = new URL(`${getBaseUrl()}/api/confirm-invite`);

    url.searchParams.append('eventShortId', event.shortId!);
    url.searchParams.append('email', user.email);

    await postmark.sendTransactionalEmail({
      from: 'WannaGo Team <hi@wannago.app>',
      to: user.email,
      subject: `You're invited to: "${event.title}"!`,
      htmlString: render(
        <EventInvite
          title={event.title}
          address={event.address}
          confirmUrl={url.toString()}
          startDate={formatDate(event.startDate, 'MMMM d, yyyy')}
          endDate={formatDate(event.endDate, 'MMMM d, yyyy')}
          organizerName={`${organizerUser.firstName} ${organizerUser.lastName}`}
        />
      ),
    });
  }

  if (input.type === EmailType.MessageToOrganizer) {
    const {
      email,
      eventId,
      firstName,
      lastName,
      message,
      organizerEmail,
      subject,
    } = sendQuestionToOrganizerEmailSchema.parse(input);

    const event = await prisma.event.findUnique({where: {id: eventId}});

    if (!event) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Event not found',
      });
    }

    await postmark.sendTransactionalEmail({
      from: `${firstName} ${lastName} <${email}>`,
      to: organizerEmail,
      subject: 'Someone asked you a question on WannaGo',
      htmlString: render(
        <MessageToOrganizer
          eventTitle={event.title}
          eventUrl={`${getBaseUrl()}/e/${event?.shortId}`}
          message={message}
          subject={subject}
          senderName={`${firstName} ${lastName}`}
          senderEmail={email}
        />
      ),
    });
  }

  if (input.type === EmailType.MessageToAllAttendees) {
    const {eventId, message, organizerUserId, subject} =
      sendMessageToAllAttendeesEmailSchema.parse(input);

    const event = await prisma.event.findUnique({where: {id: eventId}});
    const organizerUser = await prisma.user.findUnique({
      where: {id: organizerUserId},
    });
    const signUps = await prisma.eventSignUp.findMany({
      where: {
        eventId: eventId,
      },
      include: {
        user: true,
      },
    });

    if (!event || !organizerUser) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Event or user not found',
      });
    }

    await Promise.all(
      signUps
        .map(signUp => signUp.user)
        .map(async user => {
          const messageData = {
            from: `${organizerUser.firstName} ${organizerUser.lastName} <${organizerUser.email}>`,
            to: user.email,
            subject: `Message from event organizer: "${event.title}"`,
            htmlString: render(
              <MessageToAttendees
                eventUrl={`${getBaseUrl()}/e/${event?.shortId}`}
                message={message}
                eventTitle={event.title}
                subject={subject}
              />
            ),
          };

          await postmark.sendTransactionalEmail(messageData);
        })
    );
  }

  return res.status(200).json({success: true});
}
