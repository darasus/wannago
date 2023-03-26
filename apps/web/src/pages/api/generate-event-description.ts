// import {OpenAI} from 'lib';
// import {NextApiRequest, NextApiResponse} from 'next';

import {OpenAIStream, OpenAIStreamPayload} from 'lib/src/OpenAI';

// const openai = new OpenAI();

// export default async function handle(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   try {
//     const result = await openai.generateDescription(
//       'Javascript developer conference 2023'
//     );

//     return res.json(result.data);
//   } catch (error: any) {
//     console.log(error.response);
//     return res.json({success: false});
//   }
// }

export const config = {
  runtime: 'edge',
};

const handler = async (req: Request): Promise<Response> => {
  try {
    const {prompt} = (await req.json()) as {
      prompt?: string;
    };

    if (!prompt) {
      return new Response('No prompt in the request', {status: 400});
    }

    const payload: OpenAIStreamPayload = {
      messages: [{role: 'user', content: prompt}],
    };

    const stream = await OpenAIStream(payload);
    return new Response(stream);
  } catch (error) {
    return new Response('Something went wrong.', {status: 400});
  }
};

export default handler;
