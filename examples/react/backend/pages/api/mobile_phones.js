import fsPromises from 'fs/promises';
import path from 'path';
import cors, { runMiddleware } from '../../lib/cors';

const mobilePhonesPath = path.join(process.cwd(), 'public/mocks/mobile_phones.json');

export default async function handler(req, res) {
    // Run the CORS middleware
    await runMiddleware(req, res, cors);
    if (req.method === 'GET') {
        try {
            const mobilePhones = await fsPromises.readFile(mobilePhonesPath, 'utf-8');
            const json = JSON.parse(mobilePhones);
            res.status(200).json(json);
        } catch (error) {
            res.status(500).json({ error: 'Failed to read mobile phones data' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
