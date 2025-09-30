const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const allRoutes = require('./routes/allRoutes');
dotenv.config();

const app = express();
app.use(express.json());



app.use("", allRoutes);


app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});


mongoose.connect(process.env.MONGODB_URL, { 
    useNewUrlParser: true, useUnifiedTopology: true
 })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB...', err));   


app.get('/', (req, res) => {
    res.send('Hello World!');
});   



module.exports = app;           