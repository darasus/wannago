import {TRPCError} from '@trpc/server';
import {parseISO} from 'date-fns';
import {z} from 'zod';
import {ActionContext} from '../context';
import {OpenAI} from 'langchain/llms/openai';
import {PromptTemplate} from 'langchain/prompts';
import {StructuredOutputParser} from 'langchain/output_parsers';

const validation = z.object({
  prompt: z.string(),
  firstName: z.string(),
});

const generateEventData = async (userInstruction: string, timezone: string) => {
  const parser = StructuredOutputParser.fromNamesAndDescriptions({
    title:
      "Based on the user prompt generate catchy title for the user's event. Be very creative, use more words than necessary.",
    description:
      "Generate catchy description for the user's event. Be very creative, use more words than necessary. If you use names then prefer placeholders like {name} instead of actual names. {name} is always lowercased.",
    startDate: `Current day is ${new Date().toISOString()}. Parse the date in user prompt considering user is in ${timezone} timezone. Start date that was indicated in the user's prompt, needs to be ISO 8601 format. If not mentioned then set to "unknown".`,
    endDate: `Current day is ${new Date().toISOString()}. Parse the date in user prompt considering user is in ${timezone} timezone. If end date was not indicated in the user's prompt derive approximate end date from start date, needs to be ISO 8601 format.`,
    address: `Address that was indicated in the user's prompt. If location is not provided then use "unknown".`,
    maxNumberOfAttendees: `Maximum number of attendees that was indicated in the user's prompt. If not mentioned then set to "0".`,
    imagePrompt: `Generate featured image prompt I could use to generate a featured image for the event.`,
  });
  const formatInstructions = parser.getFormatInstructions();
  const prompt = new PromptTemplate({
    template: `You're helpful assistant.\n
      Answer the users question as best as possible.\n
      {format_instructions}\n
      {instruction}`,
    inputVariables: ['instruction'],
    partialVariables: {format_instructions: formatInstructions},
  });
  const model = new OpenAI({
    temperature: 0.3,
    modelName: 'gpt-3.5-turbo',
    maxTokens: 1000,
  });
  const input = await prompt.format({
    instruction: 'User prompt: ' + userInstruction,
  });
  const response = await model.call(input);
  const data = await parser.parse(response);
  return data;
};

export function generateEventFromPrompt(ctx: ActionContext) {
  return async (input: z.infer<typeof validation>) => {
    const {prompt, firstName} = validation.parse(input);

    const data = await generateEventData(prompt, ctx.timezone);

    const responseSchema = z.object({
      title: z.string().transform(value => {
        return value
          .replaceAll('{name}', firstName)
          .replaceAll('{Name}', firstName);
      }),
      description: z.string().transform(value => {
        return value
          .replaceAll('{name}', firstName)
          .replaceAll('{Name}', firstName);
      }),
      address: z
        .string({
          required_error: `Doesn't seem like you entered an address. Please try again.`,
        })
        .transform(value => {
          if (value === 'unknown') {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: `Doesn't seem like you entered location for your event. Please try again.`,
            });
          }

          return value;
        }),
      startDate: z.string().transform(value => {
        if (value === 'unknown') {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: `Doesn't seem like you entered time of your event. Please try again.`,
          });
        }

        return parseISO(value);
      }),
      endDate: z.string().transform(value => {
        if (value === 'unknown') {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: `Doesn't seem like you entered time of your event. Please try again.`,
          });
        }

        return parseISO(value);
      }),
      maxNumberOfAttendees: z.string().transform(value => {
        if (value === 'unknown') {
          return 0;
        }

        const number = isNaN(Number(value)) ? 0 : Number(value);

        return number;
      }),
      imagePrompt: z.string().transform(value => {
        return value
          .replaceAll('{name}', 'person')
          .replaceAll('{Name}', 'person');
      }),
    });

    const output = responseSchema.parse(data);

    return output;
  };
}
