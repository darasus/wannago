import crypto from 'crypto';

export const stringToHash = (text: string) =>
  crypto.createHash('md5').update(text).digest('hex');
