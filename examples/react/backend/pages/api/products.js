import fsPromises from 'fs/promises';
import path from 'path';
import cors, { runMiddleware } from '../../lib/cors';

const productsPath = path.join(process.cwd(), 'public/mocks/products.json');

export default async function handler(req, res) {
    // Run the CORS middleware
    await runMiddleware(req, res, cors);

    if (req.method === 'GET') {
        try {
            const productsData = await fsPromises.readFile(productsPath, 'utf-8');
            const { count, next, previous, results } = JSON.parse(productsData);
            const { category } = req.query;

            let filteredProducts = results;

            if (category) {
                filteredProducts = results.filter(
                    (product) => product.category.id === parseInt(category)
                );
            }

            res.status(200).json({
                count: filteredProducts.length,
                next: null,
                previous: null,
                results: filteredProducts
            });
        } catch (error) {
            res.status(500).json({ error: 'Failed to read products data' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
