const connetToMongo = require('./db');
const express = require('express');
const bodyParser= require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const http = require("http");
require('dotenv').config();


connetToMongo();
const app = express();

app.use(express.json());
app.use(cors())
app.use(bodyParser.urlencoded({extended:true}))
app.use(fileUpload());

const port = 4000;

app.use('/api/auth',require('./auth.js'))

const server = http.createServer(app);

server.listen(process.env.PORT || port,()=>{
    console.log(`Server is listening at ${port}`);
})