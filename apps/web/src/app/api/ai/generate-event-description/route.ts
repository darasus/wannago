import {OpenAIStream, OpenAIStreamPayload} from 'lib/src/OpenAI';

export const runtime = 'edge';

export async function GET(req: Request) {
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
}
