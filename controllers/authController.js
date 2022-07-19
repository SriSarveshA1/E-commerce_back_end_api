const db=require('../models');
const bcrypt=require('bcryptjs');
const { User } = require('../models');
const Op=db.Sequelize.Op;//we are getting the Op class which has all the operations like(>,<,<>,in....etc) from the Sequelize module
const jwt=require('jsonwebtoken');
const secretKey = require("../configs/secret.config");

//this controller will handle the signup
exports.signup=(req,res)=>{
    //here we do the User Registration
    //console.log("gopal da vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv............................................................");
    const UserObj={
        username:req.body.username,
        email:req.body.email,
        password:bcrypt.hashSync(req.body.password,8)//so we are going to store the password in encrypted format (sync makes this like syncronous)
        
    }
    db.User.create(UserObj).then((user)=>{
        //so we assinged the user with the name and email and password that the user provided in the request body
        //so we need to assign role to the user if the [roles] so generally the "roles"="["customer","admin"]" is passed like this in the request body
        //if the roles is provided in the request body we assign all the roles to the user if its not present in the request body then we provide the default role as customer
        if(req.body.roles)
        {//if role is provide
            db.Role.findAll({ 
                where: {
                    name:{
                        //this req.body.roles will contain an array of roles which we are destructuring into operations of or and trying to match with the column name of the Role table
                        [Op.or]:req.body.roles//so if the user wants to get assigned by multiple roles then he passess an array of roles and based on the matching of availabe roles we assign the roles
                    }
                }
            }).then((roles) => {
                //this roles is an array of objects of roles that are matched
                //user is the user object we got from the above success promise of the user object which is matched
                //console.log(roles);
                user.setRoles(roles).then(()=>{
                    res.status(201).send("User successfully registered");
                }).catch((err) => {res.status(500).send(err.message)});
            })

        }
        else{
         //if role is not provided in the request body we need to assign the defualt role
          user.setRoles([1]).then(()=>{
              res.status(200).send("Registration successfully");

          }).catch(err=>{res.status(500).send(err.message)});
        }
    })
}

exports.signin=(req,res)=>{
    //if the already registed users email is present in the db we will get by this 
    User.findOne({
        where:{
            email:req.body.email
        }
    }).then((user)=>{
        if(!user)
        {
            //if user object doesnt exist we send an error
            res.status(404).send("User doesnt exist");
        }
        //if the user is already existing then we check the password provided is valid or not
        //the req.body.password is encrypted and compared with the user.passward(which is already ecrypted and stored in the db)
        var isPasswordsValid =bcrypt.compareSync(req.body.password,user.password);
        if(!isPasswordsValid)
        {
            res.status(404).send("Password provided is not valid");
        }

        //so if the provided mail id and password are matched the user is logged in and we neeed to send access token as a responce so that the user can use it again and get authorized for accessing the resources;
                                                        //this jwt expiresIn in the 300 seconds
        var token=jwt.sign({id:user.id},secretKey.secret,{expiresIn:300});

        //we need to provide the list of roles that this user has as authorities in response
        
        var authorities =[];
        //this user object has method(which we got using Many to many relationship)
        user.getRoles().then(roles=>{
               /*
               roles=[
                   {
                       id:1,
                       username:customer
                   },
                   {
                       id:2,
                       username:admin
                   }
               ]
               */
              //console.log(roles);
              
               for(var i=0;i<roles.length;i++)
               {                            
                   authorities.push("ROLE_"+roles[i].name);
               }
               
               res.status(200).send({
                id:user.id,
                username:user.username,
                email:user.email,
                roles:authorities,
                accesstoken:token
              });
        });
       

    }).catch((err) => {
        res.status(500).send({message:err.message});
    })

}