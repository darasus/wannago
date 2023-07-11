import {test} from '@playwright/test';
import {user_1_email, user_1_id} from './constants';
import {createEvent, login} from './utils';

test('can create free event', async ({page}) => {
  await page.goto('/');
  await login({page, email: user_1_email});
  await createEvent({page, authorId: user_1_id});
});
