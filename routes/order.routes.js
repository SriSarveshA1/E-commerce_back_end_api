const orderController = require('../controllers/order.controller');
const {authJwt}=require("../middleware/index");

module.exports=(app)=>{

    //Only authenticated user can create the order
    app.post("/ecom/api/v1/orders",[authJwt.verifyToken],orderController.create);


    //Get all the orders only admin can do this
    app.get("/ecom/api/v1/orders",[authJwt.verifyToken,authJwt.isAdmin],orderController.getAllOrders);


    //Get all the orders placed by certain userId (authenticated user can perform this)
    app.get("/ecom/api/v1/orders/:UserId",[authJwt.verifyToken],orderController.findById);

    //Update the order status (we pass the status in query param) Only admin can do this
    //We pass the order id we wanna update.
    app.put("/ecom/api/v1/orders/:id",[authJwt.verifyToken,authJwt.isAdmin],orderController.update);



}   