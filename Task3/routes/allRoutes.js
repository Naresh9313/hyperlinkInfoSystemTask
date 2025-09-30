const express = require('express');
const router = express.Router();


const user = require('./userRoutes/userRoutes');
router.use(user);

const post = require('./postRoutes/postRoutes');
router.use(post);


module.exports = router;
