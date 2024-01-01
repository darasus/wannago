import {Resend} from 'resend';
import {env} from 'env/server';

// TODO: set this as config
export enum Emails {
  Hi = 'hi@wannago.app',
}

export const resend = new Resend(env.RESEND_API_KEY);
