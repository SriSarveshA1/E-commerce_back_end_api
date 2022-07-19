const authController = require('../controllers/authController');
const {verifySignup,verifySignin}=require('../middleware/index');
module.exports =(app)=>{
    app.post("/ecom/api/v1/auth/signup",[verifySignup.checkDuplicateUser_email_or_password],authController.signup);
    app.post("/ecom/api/v1/auth/signin", [verifySignin.Check_empty_mail_password],authController.signin);
}
