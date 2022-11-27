import {NextApiRequest, NextApiResponse} from 'next';
import fs from 'fs';
import FormData from 'form-data';
import formidable from 'formidable';
import fetch from 'node-fetch';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(405).json({error: 'Method Not Allowed'});
  }

  const form = new formidable.IncomingForm();

  form.parse(req, async function (err, fields, files) {
    const file = files.file as formidable.File;
    const fileName = file.originalFilename as string;
    const buffer = fs.readFileSync(file.filepath);
    const payload = new FormData();

    payload.append('requireSignedURLs', 'false');
    payload.append('file', buffer, fileName);

    const image = await fetch(
      'https://api.cloudflare.com/client/v4/accounts/520ed574991657981b4927dda46f2477/images/v1',
      {
        method: 'POST',
        body: payload as any,
        headers: {
          Authorization: `Bearer ${process.env.CLOUDFLARE_IMAGES_API_KEY}`,
          'Content-Type': `multipart/form-data; boundary=${payload.getBoundary()}`,
        },
      }
    );

    const response = await image.json();

    res.status(200).json(response);
  });
}
