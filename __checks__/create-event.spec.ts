import {test, expect} from '@playwright/test';
import {testUrl, user_1_email, user_1_id} from './constants';
import {createEvent, login} from './utils';

test.use({actionTimeout: 20000});

test('can create free event', async ({page}) => {
  await page.goto(process.env.ENVIRONMENT_URL || testUrl);

  await login({page, email: user_1_email});

  await createEvent({page, authorId: user_1_id});
});
