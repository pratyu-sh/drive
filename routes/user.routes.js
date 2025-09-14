const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { query , validationResult } = require('express-validator');
const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

router.get('/test',(req,res)=>{
    res.send("test");
})


// User ko register form dikhane wala route
router.get('/register',(req,res)=>{
    res.render('register');
})


//user ka data frontend form se server me bhejne wlaa route
router.post('/register',
    body('email').trim().isEmail().isLength({min:13}),
    body('password').trim().isLength({min:5}),
    body('username').trim().isLength({min:3}),
    async (req,res)=>{
  

        //error handle here 
        const errors = validationResult(req);
         if(!errors.isEmpty())
         {
            return res.status(400).json(
                {errors:errors.array(),
                    message:"Invalid data"
                })
         }

         // user register in database
        const { username , email, password}= req.body;

        const hashpassword = await bcrypt.hash(password, 10,)

        const createduser = await userModel.create({
            username,
            email,
            password:hashpassword

        })
        res.json(createduser);

})


router.get('/login',(req,res)=>{
    res.render('login');
})

router.post('/login',
    body('username').trim().isLength({min:3}),
    body('password').trim().isLength({min:5}),

     async (req,res)=>{

        const errors = validationResult(req);

        if(!errors.isEmpty())
        {
            res.status(400).json({
                error: errors.array(),
                message:"Invalid data"
            })
        }
    
        const {username , password} = req.body;

        const user = await userModel.findOne({
            username: username
        })

        if(!user)
        {
            return res.status(400).json({
                message:"username or password are incorrect"
            })
        }

        const isMatch = await bcrypt.compare(password , user.password )

        if(!isMatch)
        {
            return res.status(400).json({
                message:"username or password are incorrect"
            })
        }

        const token = jwt.sign({
            id: user._id,
            username: user.username,
            email: user.email
        }, process.env.JWT_SECRET,)

        res.cookie('token', token)

        res.send('logged in');



})

module.exports = router;