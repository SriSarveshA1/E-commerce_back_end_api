
const config=require('../configs/secret.config')
const jwt=require('jsonwebtoken');
const db=require('../models/index');
const User=db.User;

//so here we are going to take the token from the request header and we use jwtwebtoken to verify the token(we do expiry check and whether the token is correct) we also need secret data that we used to do this token 
const verifyToken=(req,res,next) => {
    //we get token from the headers 
    var token=req.headers['x-access-token'];
    if(!token)
    {
        //token is not passed
        return res.status(403).send({message:"There is no token provided to verify"});
    }

    jwt.verify(token,config.secret,(err,decodedKey) => {
        if(err)
        {
            //if any error occurs we try to send the message as invalid token when we try to validate
            res.status(401).send({message:"Invalid token"});
            return;
        }
        //decodedKey has info of the user(particular infor using which we created token)
        req.userId=decodedKey.id;
        next();
    });

}

const isAdmin=(req,res,next) => {
    
  User.findByPk(req.userId).then((user) => {
        //since the roles to the particular user is set using the setRoles method (due to many to many relationship) and there is no roles property assigned to the User model so the only way to get the roles assingned to a user is to use the same technique of user.getRoles().then().catch()
      

        user.getRoles().then((roles) => {
            console.log(roles);
        for(let i=0;i<roles.length;i++) {
            console.log(roles[i].name);
            if(roles[i].name=="admin")
            {
                next();
                return;
            }
           
        }
         return res.status(400).send({message:"User is not admin"})
        
       }).catch((err) => {
           return res.status(500).send({message:err.message});
       })
       
      ;
  }).catch((err) => {
       return res.status(400).send({message: err.message});
  })
  
 
}

module.exports={
   verifyToken,
   isAdmin
}

