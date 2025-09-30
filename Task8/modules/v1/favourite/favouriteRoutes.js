import  express from 'express';
import favouriteController from './favouriteController.js';


const router = express.Router();



//category
router.post("/addFavourite",favouriteController.addFavourite)
router.get("/getFavourite",favouriteController.getFavourite)
router.get("/removeFavourite",favouriteController.removeFavourite)


export default router