import fsPromises from 'fs/promises';
import path from 'path';
import cors, { runMiddleware } from '../../../lib/cors';

const categoriesPath = path.join(process.cwd(), 'public/mocks/categories.json');

export default async function handler(req, res) {
    // Run the CORS middleware
    await runMiddleware(req, res, cors);

    if (req.method === 'GET') {
        const { id } = req.query;
        try {
            const categoriesData = await fsPromises.readFile(categoriesPath, 'utf-8');
            const { results } = JSON.parse(categoriesData);
            const category = results.find(cat => cat.id === parseInt(id));
            if (category) {
                res.status(200).json(category);
            } else {
                res.status(404).json({ error: 'Category not found' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Failed to read categories data' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
