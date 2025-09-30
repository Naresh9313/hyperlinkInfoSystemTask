import  express from 'express';

import countryController from '../controller/countryController.js';

const router = express.Router();

router.get("/getCountries",countryController.getCountries)

export default router;
