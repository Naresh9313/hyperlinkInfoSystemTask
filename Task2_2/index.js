const express = require('express'); 
const dotenv = require('dotenv');
dotenv.config();
const bodyParser = require("body-parser");
const routes = require('./routes/allRoutes');

const app = express();

app.use(bodyParser.json());




app.use(express.json());

app.use('', routes);


app.get('/',(req,res)=>{
    res.send('Hello World!');
});

app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
});

module.exports = app;



