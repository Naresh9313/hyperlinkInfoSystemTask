const express  = require('express');
const router = express.Router();
const jokesController = require('../controller/jokes');


router.post('/addJoke', jokesController.addJoke);
router.get('/jokes', jokesController.getJokes);
router.get('/randomJoke', jokesController.getRandomJoke);

module.exports = router;