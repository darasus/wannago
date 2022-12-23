import {NextApiRequest, NextApiResponse} from 'next';
import {z} from 'zod';
import {Client} from '@googlemaps/google-maps-services-js';

const scheme = z.object({
  query: z.string(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(405).json({error: 'Method Not Allowed'});
  }

  const body = scheme.parse(JSON.parse(req.body));

  const client = new Client();

  const response = await client.placeAutocomplete({
    params: {
      key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
      input: body.query,
    },
  });

  res.status(200).json(response.data);
}
