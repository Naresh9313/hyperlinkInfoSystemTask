import dotenv from 'dotenv'
dotenv.config();

const Gloabals = {
    PORT:process.env.PORT,
    MONGODB_CONN:process.env.MONGODB_CONN,
    KEY:process.env.KEY,
    IV:process.env.Iv,
    JWT_SECRET:process.env.JWT_SECRET,
    JWT_EXPIRES_IN:process.env.JWT_EXPIRES_IN
}

export default Gloabals