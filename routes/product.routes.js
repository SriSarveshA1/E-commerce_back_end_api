const ProductController = require('../controllers/product.controller');
const {requestValidator,authJwt}=require("../middleware/index");
module.exports=(app)=>{
    
    //for handling the post request of creating a product data
    app.post('/ecom/api/v1/products',[authJwt.verifyToken,authJwt.isAdmin,requestValidator.validateProductRequest], ProductController.create);

    //for handling the get request that gets all the products   and also to get as queryparams getting based on name
    app.get('/ecom/api/v1/products',ProductController.findAll);

    //for getting the Product based on id
    app.get('/ecom/api/v1/products/:id',ProductController.findOne);

    //for deleting the Product based on id
    app.delete('/ecom/api/v1/products/:id',[authJwt.verifyToken,authJwt.isAdmin,requestValidator.validateProductRequest],ProductController.delete)

    //for updating the Product based on id
    app.put('/ecom/api/v1/products/:id',[authJwt.verifyToken,authJwt.isAdmin,requestValidator.validateProductRequest],ProductController.update);
 
}