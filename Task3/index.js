const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');  
const allRoutes = require('./routes/allRoutes');
const errorHandler = require('./middleware/errorHandler');


dotenv.config();
const app = express();
app.use(express.json());

app.use('',allRoutes);
app.use('',errorHandler);

bodyParser.urlencoded({ extended: true });

app.use(express.urlencoded({ extended: true }));

app.listen(process.env.PORT, () => {
    console.log('Server is running on port ', process.env.PORT);
});

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));


