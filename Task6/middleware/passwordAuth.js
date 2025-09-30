import basicAuth from 'basic-auth';
import dotenv from 'dotenv';

dotenv.config();

const authenticateDoc = (req, res, next) => {
    const credentials = basicAuth(req);

    if (
        !credentials ||
        credentials.name !== process.env.SWAGGER_USERNAME ||
        credentials.pass !== process.env.SWAGGER_PASSWORD
    ) {
        res.set('WWW-Authenticate', 'Basic realm="Authorization Required"');
        res.status(401).send('Unauthorized');
    } else {
        next();
    }
};

export default {
    authenticateDoc,
};
