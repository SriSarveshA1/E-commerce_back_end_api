 const db=require("../models/index");
 const Op=db.Sequelize.Op;
 const constants=require("../constants/constants");
 const Cart=db.Cart;
 const Order=db.Order;
 
 //So the normal customer will hit the create order api and he pass the cart Id's
   
         /*
           1.From the cartId we get all the products of that cart 
           2.From that we calculate the  total_no_of_items and total_price
           3.And send the details to the user who has placed the order.
           4.As default order status will be ORDER_PLACED and admin alone is authorized to change the status of the order
           5.At last we return the totalitems,price and what are the items that have been ordered
         */

exports.create=(req,res)=>{

    var total_items=0;
    var total_price=0;
    var description=[];

    var cartId=req.body.cartIds;//So the user will be passing the cartId (we have to ensure that these cartId belongs to the same persson who is going to create the order)
    Cart.findOne({
        where:{
           id:cartId
        }
        
    }).then((cart)=>
    {
        //If cart is empty
        if(!cart)
        {
            //so if there are no carts present with the given id's we return error.
            return res.status(404).send({message:"There are no cart with the given id's'"});
        }
   
        
         //So one cart has many products we are getting it from the cart and iniside a loop we are calculating the description and total price value.
           cart.getProducts().then((products) =>{
                 //So this products is an array that contains list of products.
                 console.log("..........vvvvvvvvvvvvvvv")
                 for(var j=0; j<products.length; j++)
                 {
                   var obj={};
                   obj.id=products[j].id;
                   obj.name=products[j].name;
                   obj.cost=products[j].cost;
                   
                   description.push(obj);//Adding the product description to the overall description

                   total_price+=obj.cost;//updating overall cost

                 }
                 total_items+=description.length;
                 console.log("descriptioN===== "+ description);
                 console.log(req.userId);
                 var orderObject ={
                   
                    UserId: req.userId,
                     total_no_items:total_items,
                     total_price:total_price,
                     order_status:constants.ORDER_PLACED,
                    
                 }
                 Order.create(orderObject).then((order)=>{
                    console.log(".......")
                     res.status(201).send({
                         UserId:req.userId,
                         total_price:total_price,
                         total_no_items:total_items,
                         
                         order_status:constants.ORDER_PLACED,
                         description:description,
                        
                     })
                 })
                })   
        
    }).catch((err)=>{
            res.status(500).send({message:err.message});
    })  
       
}


    
/* (Update the order)
And Customer can any time cancel the order and that time we change the status of the order to cancel and delete the order.
*/
exports.update=(req,res)=>{
    var cur_status=req.body.order_status;
    var obj={
        order_status:cur_status
    }
    Order.update(obj,{
        where:{
            id:req.params.id//id of the order
        },
        returning:true
    }).then(()=>{
        Order.findByPk(req.params.id).then((order)=>{
            res.status(200).send(order);
        })
    }).catch((err)=>{
        res.status(500).send({message:err.message});
    })
}



/*(Get all the orders placed by the userId)

*/
exports.findById=(req,res)=>{
    Order.findAll({
        where:{UserId:req.params.UserId}
    }).then((orders)=>{
        res.status(200).send(orders);
    })
}



/*(Get all the orders --This can be done only by the admin)

*/
exports.getAllOrders=(req,res)=>{
    Order.findAll().then((orders)=>{
        res.status(200).send(orders);
    }).catch((err)=>{
        res.status(500).send({message:err.message})
    })
}


