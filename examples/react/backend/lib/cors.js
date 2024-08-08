import Cors from 'cors';

// Initializing the cors middleware
const cors = Cors({
    methods: ['GET', 'HEAD'],
    origin: 'http://localhost:5000',
    optionsSuccessStatus: 200,
});

// Helper method to wait for a middleware to execute before continuing
function runMiddleware(req, res, fn) {
    return new Promise((resolve, reject) => {
        fn(req, res, (result) => {
            if (result instanceof Error) {
                return reject(result);
            }
            return resolve(result);
        });
    });
}

export default cors;
export { runMiddleware };
