import {NextApiRequest, NextApiResponse} from 'next';
import {OpenAI} from 'langchain/llms/openai';
import {PromptTemplate} from 'langchain/prompts';
import {StructuredOutputParser} from 'langchain/output_parsers';

const generateEventData = async (userInstruction: string) => {
  const parser = StructuredOutputParser.fromNamesAndDescriptions({
    title:
      "Based on the user prompt generate catchy title for the user's event. Be very creative, use more words than necessary.",
    description:
      "Generate catchy description for the user's event. Be very creative, use more words than necessary. If you use names then prefer placeholders like {name} instead of actual names. {name} is always lowercased.",
    startDate: `Current day is ${new Date().toISOString()}. Parse the date in user prompt considering user is in Amsterdam timezone. Start date that was indicated in the user's prompt, needs to be ISO 8601 format. If not mentioned then set to "unknown".`,
    endDate: `Current day is ${new Date().toISOString()}. Parse the date in user prompt considering user is in Amsterdam timezone. If end date was not indicated in the user's prompt derive approximate end date from start date, needs to be ISO 8601 format.`,
    address: `Address that was indicated in the user's prompt. If location is not provided then use "unknown".`,
    maxNumberOfAttendees: `Maximum number of attendees that was indicated in the user's prompt. If not mentioned then set to "0".`,
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
  const model = new OpenAI({temperature: 0, modelName: 'gpt-3.5-turbo'});
  const input = await prompt.format({
    instruction: 'User prompt: ' + userInstruction,
  });
  const response = await model.call(input);
  const data = await parser.parse(response);
  return data;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const userInstruction = req.query.prompt as string;
  const data = await generateEventData(userInstruction);

  console.log(JSON.stringify(data, null, 2));

  res.status(200).json({userInstruction, output: data});
}
