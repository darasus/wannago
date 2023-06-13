import * as validation from './validation';
import {Postmark} from 'lib';
import {render} from 'email';
import {LoginCode} from 'email';

const postmark = new Postmark();

export const email = {
  created: async (input: validation.Input) => {
    const {data} = validation.email.created.parse(input);

    await postmark.sendToTransactionalStream({
      to: data.to_email_address,
      subject: data.subject,
      htmlString: render(<LoginCode code={data.data.otp_code} />),
    });
  },
};
