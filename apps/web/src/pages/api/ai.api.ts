import {NextApiRequest, NextApiResponse} from 'next';
import {OpenAI} from 'langchain/llms/openai';
import {PromptTemplate} from 'langchain/prompts';
import {StructuredOutputParser} from 'langchain/output_parsers';

// const userInstruction =
// "I want to celebrate house warming with my friends and family. My event starts today at 3pm and lasts for 2 hours 33 minutes, it is at 123 Main St, New York. I'm thinking of inviting around 53 people.";
// 'Birthday lunch tomorrow at 12pm, in Permanent cafe (amsterdam)';

const generateEventData = async (userInstruction: string) => {
  const parser = StructuredOutputParser.fromNamesAndDescriptions({
    title:
      "Based on the prompt generate catchy title for the user's event. Be very creative, use more words than necessary.",
    description:
      "Generate catchy description for the user's event. Be very creative, use more words than necessary. If you use names then prefer placeholders like {name} instead of actual names.",
    startDate: `Current day is ${new Date().toISOString()}. Start date that was indicated in the user's prompt, needs to be ISO 8601 format. If year or month not mentioned then use current year and month.`,
    endDate: `Current day is ${new Date().toISOString()}. End date that was indicated in the user's prompt, needs to be ISO 8601 format. If year or month not mentioned then use current year and month.`,
    address: "address that was indicated in the user's prompt",
    maxNumberOfAttendees:
      "Maximum number of attendees that was indicated in the user's prompt. If not mentioned then set to '0'.",
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
  const model = new OpenAI({temperature: 0});
  const input = await prompt.format({
    instruction: userInstruction,
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

  res.status(200).json({userInstruction, output: data});
}
