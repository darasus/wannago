import {EmailType} from '@prisma/client';
import {
  baseEventHandlerSchema,
  handleEventSignUp,
  handleEventSignUpInputSchema,
  handleEventInvite,
  handleEventInviteInputSchema,
  handleMessageToOrganizer,
  handleMessageToOrganizerInputSchema,
  handleMessageToAllAttendees,
  handleMessageToAllAttendeesInputSchema,
  handleAfterRegisterNoCreatedEventFollowUpEmail,
  handleAfterRegisterNoCreatedEventFollowUpEmailInputSchema,
  handleEventCancelInvite,
  handleEventCancelInviteInputSchema,
  handleEventCancelSignUp,
  handleEventCancelSignUpInputSchema,
  handleOrganizerEventSignUpNotificationEmail,
  handleOrganizerEventSignUpNotificationEmailInputSchema,
} from 'email-handlers';
import {NextApiRequest, NextApiResponse} from 'next';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(405).json({error: 'Method Not Allowed'});
  }

  const input = baseEventHandlerSchema.parse(req.body);

  if (input.type === EmailType.EventSignUp) {
    await handleEventSignUp(handleEventSignUpInputSchema.parse(input));
  }

  if (input.type === EmailType.EventInvite) {
    await handleEventInvite(handleEventInviteInputSchema.parse(input));
  }

  if (input.type === EmailType.MessageToOrganizer) {
    await handleMessageToOrganizer(
      handleMessageToOrganizerInputSchema.parse(input)
    );
  }

  if (input.type === EmailType.MessageToAllAttendees) {
    await handleMessageToAllAttendees(
      handleMessageToAllAttendeesInputSchema.parse(input)
    );
  }

  if (input.type === EmailType.AfterRegisterNoCreatedEventFollowUpEmail) {
    await handleAfterRegisterNoCreatedEventFollowUpEmail(
      handleAfterRegisterNoCreatedEventFollowUpEmailInputSchema.parse(input)
    );
  }

  if (input.type === EmailType.EventCancelInvite) {
    await handleEventCancelInvite(
      handleEventCancelInviteInputSchema.parse(input)
    );
  }

  if (input.type === EmailType.EventCancelSignUp) {
    await handleEventCancelSignUp(
      handleEventCancelSignUpInputSchema.parse(input)
    );
  }

  if (input.type === EmailType.OrganizerEventSignUpNotification) {
    await handleOrganizerEventSignUpNotificationEmail(
      handleOrganizerEventSignUpNotificationEmailInputSchema.parse(input)
    );
  }

  return res.status(200).json({success: true});
}
