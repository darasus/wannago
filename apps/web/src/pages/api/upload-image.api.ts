import {NextApiRequest, NextApiResponse} from 'next';
import fs from 'fs';
import FormData from 'form-data';
import formidable from 'formidable';
import axios from 'axios';
import {env} from 'server-env';
import {getImageMetaData} from 'utils';
import sharp from 'sharp';

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

    const newBuffer = await sharp(buffer).resize(1200).webp().toBuffer();

    payload.append('requireSignedURLs', 'false');
    payload.append('file', newBuffer, fileName);

    try {
      const response = await axios.post(
        'https://api.cloudflare.com/client/v4/accounts/520ed574991657981b4927dda46f2477/images/v1',
        payload,
        {
          headers: {
            Authorization: `Bearer ${env.CLOUDFLARE_API_KEY}`,
          },
        }
      );

      const url = response?.data?.result?.variants[0] as string;
      const {height, width, imageSrcBase64} = await getImageMetaData(url);

      res.status(200).json({url, imageSrcBase64, height, width});
    } catch (error) {
      res.status(400).json(error);
    }
  });
}
