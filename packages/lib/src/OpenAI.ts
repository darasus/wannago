import {env} from 'server-env';
import {createParser, ParsedEvent, ReconnectInterval} from 'eventsource-parser';

const systemInput = [
  {
    role: 'system',
    content: `You are a helpful assistant helping user generate descriptions for their event.`,
  },
  {
    role: 'system',
    content: `Make event descriptions sound more official if the cause is professional.`,
  },
  {
    role: 'system',
    content: `If it's a birthday of a teenage person then make it less official, more fun sounding. The older the person is the more serious the tone should be.`,
  },
  {
    role: 'system',
    content: `If it's a business event make it sound very professional.`,
  },
  {
    role: 'system',
    content: `If it's a tech event like developer conference or meetup then make it sound more technical. You can also use technical jargon in that case.`,
  },
  {
    role: 'system',
    content: `Try to respond with at least few sentences if event if not very official`,
  },
  {
    role: 'system',
    content: `Try to respond with more sentences if event is more official`,
  },
  {
    role: 'system',
    content: `Use greetings and introductions if necessary`,
  },
  {
    role: 'system',
    content: `Use new lines to separate paragraphs if necessary`,
  },
  {
    role: 'system',
    content: `Please respond with event description only.`,
  },
];

export type ChatGPTAgent = 'user' | 'system';

export interface ChatGPTMessage {
  role: ChatGPTAgent;
  content: string;
}

export interface OpenAIStreamPayload {
  messages: ChatGPTMessage[];
}

export async function OpenAIStream(payload: OpenAIStreamPayload) {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  let counter = 0;

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.OPENAI_API_KEY}`,
    },
    method: 'POST',
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      temperature: 0.7,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      max_tokens: 1000,
      stream: true,
      n: 1,
      messages: [...systemInput, ...payload.messages],
    }),
  });

  const stream = new ReadableStream({
    async start(controller) {
      // callback
      function onParse(event: ParsedEvent | ReconnectInterval) {
        if (event.type === 'event') {
          const data = event.data;
          // https://beta.openai.com/docs/api-reference/completions/create#completions/create-stream
          if (data === '[DONE]') {
            controller.close();
            return;
          }
          try {
            const json = JSON.parse(data);
            const text = json.choices[0].delta?.content || '';
            if (counter < 2 && (text.match(/\n/) || []).length) {
              // this is a prefix character (i.e., "\n\n"), do nothing
              return;
            }
            const queue = encoder.encode(text);
            controller.enqueue(queue);
            counter++;
          } catch (e) {
            // maybe parse error
            controller.error(e);
          }
        }
      }

      // stream response (SSE) from OpenAI may be fragmented into multiple chunks
      // this ensures we properly read chunks and invoke an event for each SSE event stream
      const parser = createParser(onParse);
      // https://web.dev/streams/#asynchronous-iteration
      for await (const chunk of res.body as any) {
        parser.feed(decoder.decode(chunk));
      }
    },
  });

  return stream;
}
