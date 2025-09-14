const jwt = require('jsonwebtoken');

function auth(req,res,next){
  
    const token = req.cookies.token;

    if(!token){
        res.status(401).json({
            message:"Unauthorized"
        })
    }

    try{
        const decoded = jwt.verify(token , process.env.JWT_SECRET);
        req.user = decoded;
        return next();
        
      } 

    catch(err)
    {
       res.status(401).json({
          messsage: " Unauthorised"
       })
    }    

}

module.exports = auth;