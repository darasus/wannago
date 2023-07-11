import {test} from '@playwright/test';
import {user_1_email} from './constants';
import {login} from './utils';
import {prepare} from './utils/prepare';

test.beforeAll(() => {
  prepare();
});

test('can login', async ({page}) => {
  await login({page, email: user_1_email});
});
