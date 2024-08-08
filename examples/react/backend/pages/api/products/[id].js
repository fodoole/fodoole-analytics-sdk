import fsPromises from 'fs/promises';
import path from 'path';
import cors, { runMiddleware } from '../../../lib/cors';

const productsPath = path.join(process.cwd(), 'public/mocks/products.json');

export default async function handler(req, res) {
    // Run the CORS middleware
    await runMiddleware(req, res, cors);
    const {
        query: { id },
        method
    } = req;

    if (method === 'GET') {
        try {
            const products = await fsPromises.readFile(productsPath, 'utf-8');
            const { results } = JSON.parse(products);
            const product = results.find(p => p.id === parseInt(id, 10));

            if (product) {
                res.status(200).json(product);
            } else {
                res.status(404).json({ message: 'Product not found' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Failed to read products data' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
}
