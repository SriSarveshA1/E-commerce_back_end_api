
const Check_empty_mail_password=(req,res,next) => {
   if(!req.body.email){
       return res.status(404).send({message: 'Enter the mail id it should not be empty'});
   }
   else{
       if(!req.body.password)
       {
        return res.status(404).send({message: 'Enter the password it should not be empty'});   
       }
       else{
           next();
       }
   }
}
module.exports={
    Check_empty_mail_password
}