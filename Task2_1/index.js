const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const allRoutes = require('./routes/allRoutes');

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use('', allRoutes);

app.listen(process.env.PORT, () => {
    console.log('Server is running on port',process.env.PORT);
});
