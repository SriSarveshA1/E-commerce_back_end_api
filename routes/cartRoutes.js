const cartController=require('../controllers/cart.controller');
const {requestValidator,authJwt}=require("../middleware/index");
module.exports=(app)=>{
    //to initialize an empty cart
    app.post("/ecom/api/v1/carts",[authJwt.verifyToken],cartController.Create);
    //to get the cart information
    app.get("/ecom/api/v1/carts/:id",[authJwt.verifyToken],cartController.getCart);
    //to update the cart by adding products [ids to the cart]
    app.put("/ecom/api/v1/carts/:id",[authJwt.verifyToken],cartController.update)
}