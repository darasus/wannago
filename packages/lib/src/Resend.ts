import {Resend} from 'resend';
import {env} from 'server-env';

export enum Emails {
  Hi = 'hi@wannago.app',
}

export const resend = new Resend(env.RESEND_API_KEY);
