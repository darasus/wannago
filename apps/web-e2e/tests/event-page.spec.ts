import {test, expect} from '@playwright/test';
import {Auth} from '../models/Auth';

// as a participant
// can view event details (picture, title, description, date, time, location, host, participant count)
// can sign up (see toast and participant count increase)
// can ask a question
// can download ics file

test('Can see event page details', async ({page}) => {
  const auth = new Auth(page);
  await auth.login();
});
