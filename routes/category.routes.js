
const CategoryController=require('../controllers/category.controller')
const {requestValidator,authJwt}=require("../middleware/index");//this will return an object named requestValidator so we are destructuring it 
module.exports=(app)=>{
    
    //for handling the post request of creating a category data
    app.post('/ecom/api/v1/categories',[authJwt.verifyToken,authJwt.isAdmin,requestValidator.validateCategoryRequest],CategoryController.create);

    //for handling the get request that gets all the categories   and also to get as queryparams getting based on name
    app.get('/ecom/api/v1/categories',CategoryController.findAll);

    //for getting the category based on id
    app.get('/ecom/api/v1/categories/:id',CategoryController.findOne);

    //for deleting the category based on id
    app.delete('/ecom/api/v1/categories/:id',[authJwt.verifyToken,authJwt.isAdmin,requestValidator.validateCategoryRequest],CategoryController.delete)

    //for updating the category based on id
    app.put('/ecom/api/v1/categories/:id',[authJwt.verifyToken,authJwt.isAdmin,requestValidator.validateCategoryRequest],CategoryController.update);
 
}