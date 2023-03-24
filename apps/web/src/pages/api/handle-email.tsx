import {
  baseEventHandlerSchema,
  handleEventSignUpEmail,
  handleEventSignUpEmailInputSchema,
  handleEventInviteEmail,
  handleEventInviteEmailInputSchema,
  handleMessageToOrganizerEmail,
  handleMessageToOrganizerEmailInputSchema,
  handleMessageToAllAttendeesEmail,
  handleMessageToAllAttendeesEmailInputSchema,
  handleAfterRegisterNoCreatedEventFollowUpEmail,
  handleAfterRegisterNoCreatedEventFollowUpEmailInputSchema,
  handleEventCancelInviteEmail,
  handleEventCancelInviteEmailInputSchema,
  handleEventCancelSignUpEmail,
  handleEventCancelSignUpEmailInputSchema,
  handleOrganizerEventSignUpNotificationEmail,
  handleOrganizerEventSignUpNotificationEmailInputSchema,
  handleEventReminderEmail,
  handleEventReminderEmailInputSchema,
} from 'email-handlers';
import {NextApiRequest, NextApiResponse} from 'next';
import {EmailType} from '../../types/EmailType';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(405).json({error: 'Method Not Allowed'});
  }

  const input = baseEventHandlerSchema.parse(req.body);

  if (input.type === EmailType.EventSignUp) {
    await handleEventSignUpEmail(
      handleEventSignUpEmailInputSchema.parse(input)
    );
  }

  if (input.type === EmailType.EventInvite) {
    await handleEventInviteEmail(
      handleEventInviteEmailInputSchema.parse(input)
    );
  }

  if (input.type === EmailType.MessageToOrganizer) {
    await handleMessageToOrganizerEmail(
      handleMessageToOrganizerEmailInputSchema.parse(input)
    );
  }

  if (input.type === EmailType.MessageToAllAttendees) {
    await handleMessageToAllAttendeesEmail(
      handleMessageToAllAttendeesEmailInputSchema.parse(input)
    );
  }

  if (input.type === EmailType.AfterRegisterNoCreatedEventFollowUpEmail) {
    await handleAfterRegisterNoCreatedEventFollowUpEmail(
      handleAfterRegisterNoCreatedEventFollowUpEmailInputSchema.parse(input)
    );
  }

  if (input.type === EmailType.EventCancelInvite) {
    await handleEventCancelInviteEmail(
      handleEventCancelInviteEmailInputSchema.parse(input)
    );
  }

  if (input.type === EmailType.EventCancelSignUp) {
    await handleEventCancelSignUpEmail(
      handleEventCancelSignUpEmailInputSchema.parse(input)
    );
  }

  if (input.type === EmailType.OrganizerEventSignUpNotification) {
    await handleOrganizerEventSignUpNotificationEmail(
      handleOrganizerEventSignUpNotificationEmailInputSchema.parse(input)
    );
  }

  if (input.type === EmailType.EventReminder) {
    await handleEventReminderEmail(
      handleEventReminderEmailInputSchema.parse(input)
    );
  }

  return res.status(200).json({success: true});
}
