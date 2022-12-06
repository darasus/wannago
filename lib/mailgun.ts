import formData from 'form-data';
import Mailgun from 'mailgun.js';

const mailgunIstance = new Mailgun(formData);
export const mailgun = mailgunIstance.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY!,
});
