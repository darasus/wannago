import {z} from 'zod';
import {EmailType} from 'types';

export const baseEventHandlerSchema = z
  .object({
    type: z.nativeEnum(EmailType),
  })
  .passthrough();

export const handleEventSignUpEmailInputSchema = baseEventHandlerSchema.extend({
  eventId: z.string().uuid(),
  userId: z.string().uuid(),
});

export const handleEventInviteEmailInputSchema = baseEventHandlerSchema.extend({
  eventId: z.string().uuid(),
  userId: z.string().uuid(),
});

export const handleMessageToOrganizerEmailInputSchema =
  baseEventHandlerSchema.extend({
    eventId: z.string().uuid(),
    senderName: z.string(),
    organizerEmail: z.string().email(),
    email: z.string().email(),
    subject: z.string(),
    message: z.string(),
  });

export const handleMessageToAllAttendeesEmailInputSchema =
  baseEventHandlerSchema.extend({
    subject: z.string(),
    message: z.string(),
    eventId: z.string().uuid(),
    organizerId: z.string().uuid(),
  });

export const handleAfterRegisterNoCreatedEventFollowUpEmailInputSchema =
  baseEventHandlerSchema.extend({
    userId: z.string().uuid(),
  });

export const handleEventCancelInviteEmailInputSchema =
  baseEventHandlerSchema.extend({
    userId: z.string().uuid(),
    eventId: z.string().uuid(),
  });

export const handleEventCancelSignUpEmailInputSchema =
  baseEventHandlerSchema.extend({
    userId: z.string().uuid(),
    eventId: z.string().uuid(),
  });

export const handleOrganizerEventSignUpNotificationEmailInputSchema =
  baseEventHandlerSchema.extend({
    userId: z.string().uuid(),
    eventId: z.string().uuid(),
  });

export const handleEventReminderEmailInputSchema =
  baseEventHandlerSchema.extend({
    eventId: z.string().uuid(),
  });
