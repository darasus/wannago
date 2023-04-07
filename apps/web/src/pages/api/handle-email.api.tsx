import {NextApiRequest, NextApiResponse} from 'next';
import {createContext} from 'trpc/src/context';
import {
  baseEventHandlerSchema,
  handleEventSignUpEmailInputSchema,
  handleEventInviteEmailInputSchema,
  handleMessageToOrganizerEmailInputSchema,
  handleMessageToAllAttendeesEmailInputSchema,
  handleAfterRegisterNoCreatedEventFollowUpEmailInputSchema,
  handleEventCancelInviteEmailInputSchema,
  handleEventCancelSignUpEmailInputSchema,
  handleOrganizerEventSignUpNotificationEmailInputSchema,
  handleEventReminderEmailInputSchema,
} from 'email-input-validation';
import {emailHandlerRouter} from 'trpc/src/routers/emailHandler';
import {EmailType} from 'types';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(405).json({error: 'Method Not Allowed'});
  }

  const ctx = await createContext({req, res});
  const caller = emailHandlerRouter.createCaller(ctx);

  const input = baseEventHandlerSchema.parse(req.body);

  if (input.type === EmailType.EventSignUp) {
    await caller.handleEventSignUpEmail(
      handleEventSignUpEmailInputSchema.parse(input)
    );
  }

  if (input.type === EmailType.EventInvite) {
    await caller.handleEventInviteEmail(
      handleEventInviteEmailInputSchema.parse(input)
    );
  }

  if (input.type === EmailType.MessageToOrganizer) {
    await caller.handleMessageToOrganizerEmail(
      handleMessageToOrganizerEmailInputSchema.parse(input)
    );
  }

  if (input.type === EmailType.MessageToAllAttendees) {
    await caller.handleMessageToAllAttendeesEmail(
      handleMessageToAllAttendeesEmailInputSchema.parse(input)
    );
  }

  if (input.type === EmailType.AfterRegisterNoCreatedEventFollowUpEmail) {
    await caller.handleAfterRegisterNoCreatedEventFollowUpEmail(
      handleAfterRegisterNoCreatedEventFollowUpEmailInputSchema.parse(input)
    );
  }

  if (input.type === EmailType.EventCancelInvite) {
    await caller.handleEventCancelInviteEmail(
      handleEventCancelInviteEmailInputSchema.parse(input)
    );
  }

  if (input.type === EmailType.EventCancelSignUp) {
    await caller.handleEventCancelSignUpEmail(
      handleEventCancelSignUpEmailInputSchema.parse(input)
    );
  }

  if (input.type === EmailType.OrganizerEventSignUpNotification) {
    await caller.handleOrganizerEventSignUpNotificationEmail(
      handleOrganizerEventSignUpNotificationEmailInputSchema.parse(input)
    );
  }

  if (input.type === EmailType.EventReminder) {
    await caller.handleEventReminderEmail(
      handleEventReminderEmailInputSchema.parse(input)
    );
  }

  return res.status(200).json({success: true});
}
