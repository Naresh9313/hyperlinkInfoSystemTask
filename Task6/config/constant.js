
import dotenv from 'dotenv';
dotenv.config();

const GLOBALS = {
        PORT:process.env.PORT,
        MONGO_DB:process.env.MONGO_DB,
        KEY:process.env.KEY,
        IV:process.env.IV,
        JWT_SECRET:process.env.JWT_SECRET,
        JWT_EXPIRES_IN:process.env.JWT_EXPIRES_IN
}

export default GLOBALS