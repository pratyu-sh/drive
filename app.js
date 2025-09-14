const express = require('express');
const app = express();
const { query , validationResult } = require('express-validator');

const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
dotenv.config();

const connecttoDB = require('./config/db');
connecttoDB();

const userRouter = require('./routes/user.routes');
const indexRouter = require('./routes/indes.routes');
const { connect } = require('mongoose');

app.use(cookieParser());
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.set('view engine', 'ejs');

app.use('/', indexRouter);
app.use('/user', userRouter);

app.listen(3000,()=>{
    console.log("server is running on port 3000");
});