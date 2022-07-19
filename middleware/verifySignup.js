const db=require('../models');

//const Role=db.Role;
const User=db.User;
const Op=db.Sequelize.Op;
const ROLES=db.ROLES;

const validateEmail = (email) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };

const validateUsername=(username) => {
    return username.match(/^(?=[a-zA-Z0-9._]{8,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/);
}
const validatPassword=(password)=>{
    return password.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}/);
}
const checkDuplicateUser_email_or_password=(req, res, next) => {
   
   //var Duplicate_Username=false;
    //so we need to check whether the user with provided username already exits 
    if(!req.body.username)
    {
        return res.status(400).send({message: "Enter the valid username"})
    }
    else{
       
        if(!validateUsername(req.body.username))
        {
            return res.status(400).send({message: "Enter the valid username 1.Only contains alphanumeric characters, underscore and dot.2.Underscore and dot can't be at the end or start of a username (e.g _username / username_ / .username / username.).3.Underscore or dot can't be used multiple times in a row (e.g user__name / user..name).4.Number of characters must be between 8 to 20."})
        }
        

    }
    if(!req.body.password) {
        return res.status(400).send({message: "Password is not provided"});
    }
    else{
        if(!validatPassword(req.body.password))
        {
            return res.status(400).send({message: "password is not valid:: Minimum eight characters, at least one letter and one number"});
        }
    }
    if(!req.body.email)
    {
        return res.status(400).send({message: "ENter the valid email"})
    }
    else{
      if(!validateEmail(req.body.email))
      {
        return res.status(400).send({message: "Email is not formatted"});
      }
    }
    User.findOne({where:{username: req.body.username}}).then((user) => {
       
        if(user)
        {
        //console.log("gopal 1");
         //Duplicate_Username=true;
         res.status(400).send({message:"The user with given username is already present"});
         return;
        }
        else{
           
            
            User.findOne({
                where: {
                  email: req.body.email,
                },
              }).then((user) => {
                if (user) {
                  res.status(400).send({
                    message: "Failed!email already exists",
                  });
                  return;
                }
                else{
                    var invalid_roles=[];
                    /*
                    Role.findAll({
                        where: {
                            name:{
                                [Op.or]:req.body.roles
                            }
                        }
                    }).then((roles) => {
                       */
                    for(var i=0; i<req.body.roles.length; i++)
                    {
                        //console.log("jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj")
                        //console.log(req.body.roles);
                        var value=req.body.roles[i];
                        var flag=false;
                        for(var j=0; j<ROLES.length; j++) {
                            if(value==ROLES[j])
                            {
                                flag=true;
                                break;
                            }
                
                        }
                        if(flag==false)
                        {
                            console.log("pussher")
                            invalid_roles.push(value);
                        }
                    }
                      if(invalid_roles.length>0)
                      {
                          console.log("sdcc= "+invalid_roles);
                        return res.status(400).send({message: "Invalid roles","roles":[invalid_roles]});
                      }
                      else{
                          next();
                      }
                    
                }
              });
            
        
        }
    }).catch((err) => { return res.status(400).send({message:"error while checking duplicate username"})});
   


   
 
   
}
module.exports ={
    checkDuplicateUser_email_or_password
}



