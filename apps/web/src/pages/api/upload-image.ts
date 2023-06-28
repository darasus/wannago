import {NextApiRequest, NextApiResponse} from 'next';
import fs from 'fs';
import formidable from 'formidable';
import {ImageUpload} from 'lib/src/ImageUpload';

export const config = {
  api: {
    bodyParser: false,
  },
};

const {uploadImage} = new ImageUpload();

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
    const buffer = fs.readFileSync(file.filepath);
    const uploadedImage = await uploadImage(buffer);

    if (!uploadedImage) {
      return res.status(500).json({error: 'Could not upload image'});
    }

    const {height, imageSrcBase64, url, width} = uploadedImage;

    res.status(200).json({url, imageSrcBase64, height, width});
  });
}
