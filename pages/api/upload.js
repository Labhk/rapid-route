import { IncomingForm } from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const form = new IncomingForm();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ error: 'Error parsing form data' });
      }

      const file = files.file[0];
      const fileName = file.originalFilename.replace(/\.html$/, '');
      const filePath = path.join(process.cwd(), 'public', 'up', `${fileName}.html`);

      fs.copyFileSync(file.filepath, filePath);

      res.status(200).json({ success: true, fileName });
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}