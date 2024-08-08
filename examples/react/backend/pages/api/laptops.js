import fsPromises from 'fs/promises';
import path from 'path';
import cors, { runMiddleware } from '../../lib/cors';

const laptopsPath = path.join(process.cwd(), 'public/mocks/laptops.json');

export default async function handler(req, res) {
    // Run the CORS middleware
    await runMiddleware(req, res, cors);
    if (req.method === 'GET') {
        const products = await fsPromises.readFile(laptopsPath, 'utf-8');
        const json = JSON.parse(products);
        res.status(200).json(json);
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

