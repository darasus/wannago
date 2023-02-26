import {EmailType} from '@prisma/client';
import {render} from '@react-email/render';
import {TRPCError} from '@trpc/server';
import {prisma} from 'database';
import {
  EventInvite,
  EventSignUp,
  AfterRegisterNoCreatedEventFollowUpEmail,
  MessageToAttendees,
  MessageToOrganizer,
} from 'email';
import {NextApiRequest, NextApiResponse} from 'next';
import {z} from 'zod';
import {Postmark} from '../../lib/postmark';
import {formatDate} from '../../utils/formatDate';
import {getBaseUrl} from '../../utils/getBaseUrl';

const postmark = new Postmark();

export const baseEventHandlerSchema = z
  .object({
    type: z.nativeEnum(EmailType),
  })
  .passthrough();

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(405).json({error: 'Method Not Allowed'});
  }

  const input = baseEventHandlerSchema.parse(req.body);

  if (input.type === EmailType.EventSignUp) {
    const sendEventSignUpEmailSchema = baseEventHandlerSchema.extend({
      eventId: z.string().uuid(),
      userId: z.string().uuid(),
    });

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

    if (!event) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Event not found',
      });
    }

    const user = await prisma.user.findUnique({
      where: {id: userId},
    });

    if (!user) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'User not found',
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
      replyTo: 'WannaGo Team <hi@wannago.app>',
      to: user.email,
      subject: `Thanks for signing up for "${event.title}"!`,
      htmlString: render(
        <EventSignUp
          title={event.title}
          address={event.address || 'none'}
          streamUrl={event.streamUrl || 'none'}
          eventUrl={`${getBaseUrl()}/e/${event.shortId}`}
          startDate={formatDate(event.startDate, 'MMMM d, yyyy')}
          endDate={formatDate(event.endDate, 'MMMM d, yyyy')}
          organizerName={`${organizerUser.firstName} ${organizerUser.lastName}`}
        />
      ),
    });
  }

  if (input.type === EmailType.EventInvite) {
    const sendEventInviteEmailSchema = baseEventHandlerSchema.extend({
      eventId: z.string().uuid(),
      userId: z.string().uuid(),
    });

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

    if (!event) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Event not found',
      });
    }

    const user = await prisma.user.findUnique({
      where: {id: userId},
    });

    if (!user) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'User not found',
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
      replyTo: 'WannaGo Team <hi@wannago.app>',
      to: user.email,
      subject: `You're invited to: "${event.title}"!`,
      htmlString: render(
        <EventInvite
          title={event.title}
          address={event.address || 'none'}
          streamUrl={event.streamUrl || 'none'}
          confirmUrl={url.toString()}
          startDate={formatDate(event.startDate, 'MMMM d, yyyy')}
          endDate={formatDate(event.endDate, 'MMMM d, yyyy')}
          organizerName={`${organizerUser.firstName} ${organizerUser.lastName}`}
        />
      ),
    });
  }

  if (input.type === EmailType.MessageToOrganizer) {
    const sendQuestionToOrganizerEmailSchema = baseEventHandlerSchema.extend({
      eventId: z.string().uuid(),
      organizerEmail: z.string().email(),
      firstName: z.string(),
      lastName: z.string(),
      email: z.string().email(),
      subject: z.string(),
      message: z.string(),
    });

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
      replyTo: `${firstName} ${lastName} <${email}>`,
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
    const scheme = baseEventHandlerSchema.extend({
      subject: z.string(),
      message: z.string(),
      eventId: z.string().uuid(),
      organizerUserId: z.string().uuid(),
    });

    const {eventId, message, organizerUserId, subject} = scheme.parse(input);

    const event = await prisma.event.findUnique({where: {id: eventId}});

    const organizerUser = await prisma.user.findUnique({
      where: {id: organizerUserId},
    });

    if (!organizerUser) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Organizer user not found',
      });
    }

    const signUps = await prisma.eventSignUp.findMany({
      where: {
        eventId: eventId,
      },
      include: {
        user: true,
      },
    });

    if (!event) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Event not found',
      });
    }

    await Promise.all(
      signUps
        .map(signUp => signUp.user)
        .map(async user => {
          const messageData = {
            replyTo: `${organizerUser.firstName} ${organizerUser.lastName} <${organizerUser.email}>`,
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

  if (input.type === EmailType.AfterRegisterNoCreatedEventFollowUpEmail) {
    const scheme = baseEventHandlerSchema.extend({
      userId: z.string().uuid(),
    });

    const {userId} = scheme.parse(input);

    const user = await prisma.user.findUnique({
      where: {id: userId},
    });

    if (!user) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'User not found',
      });
    }

    const eventCount = await prisma.event.count({
      where: {
        organizationId: user.organizationId,
      },
    });

    const forbidden = await prisma.emailPreference.findFirst({
      where: {
        userId: user.id,
        emailType: EmailType.AfterRegisterNoCreatedEventFollowUpEmail,
        isActive: false,
      },
    });

    if (forbidden) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Email type is forbidden',
      });
    }

    const hasNoEvents = eventCount === 0;

    if (hasNoEvents && user?.firstName) {
      await postmark.sendBroadcastEmail({
        replyTo: 'WannaGo Team <hi@wannago.app>',
        to: user.email,
        subject: 'We would love to hear your feedback',
        htmlString: render(
          <AfterRegisterNoCreatedEventFollowUpEmail
            firstName={user?.firstName}
          />
        ),
      });
    }
  }

  return res.status(200).json({success: true});
}
