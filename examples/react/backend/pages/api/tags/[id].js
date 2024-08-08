import fsPromises from 'fs/promises';
import path from 'path';
import cors, { runMiddleware } from '../../../lib/cors';

const productsPath = path.join(process.cwd(), 'public/mocks/products.json');

export default async function handler(req, res) {
    // Run the CORS middleware
    await runMiddleware(req, res, cors);

    if (req.method === 'GET') {
        const { id } = req.query;
        try {
            const productsData = await fsPromises.readFile(productsPath, 'utf-8');
            const { results } = JSON.parse(productsData);

            const filteredProducts = results.filter(product =>
                product.tags.some(tag => tag.id === parseInt(id))
            );

            if (filteredProducts.length > 0) {
                res.status(200).json({ results: filteredProducts });
            } else {
                res.status(404).json({ message: 'No products found for this tag' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Failed to read products data' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
