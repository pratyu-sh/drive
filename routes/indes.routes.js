const express = require('express');

const router = express.Router();
const multer  = require('multer');
const fileModel = require('../models/file.model');
const authMiddleware = require('../middlewares/auth');


const storage = multer.diskStorage({
    destination: function(req,file, cb){
    return cb(null,'./uploads');
    },

    filename: function(req,file,cb){
      return cb(null,`${Date.now()}-${file.originalname}`)
    }
});


const upload = multer({ storage: storage });


router.get('/',(req,res)=>{
    res.render('webpage');
})


router.get('/home',authMiddleware,async (req,res)=>{
    


    try{

    
    const userfile = await fileModel.find({
        user: req.user.id,
    })

    console.log(userfile);
    
   
    res.render('home',{userfile:userfile});


    } 
    catch(err){
        console.log(err);
        res.status(500).json({
            message:"Server error"
        })
    }

})


router.post('/upload-file', authMiddleware ,  upload.single("file") , async  (req,res)=>{
    

    const newfile = await fileModel.create({
        path: req.file.path,
        originalname: req.file.originalname,
        user: req.user.id


    })
     res.json(newfile);
    //  console.log(newfile);
})


router.get('/download/:id', authMiddleware , async (req,res)=>{
    
    const loggedInUserid = req.user.id;
    const id = req.params.id;
    const file = await fileModel.findOne({
        user: loggedInUserid,
        _id: id
    });


    if(!file)
    {
        return res.status(401).json({
            message:"Unauthorized"
        });
    }

    res.download(file.path,file.originalname);
});


module.exports = router