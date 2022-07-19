const db=require('../models');
const Cart=db.Cart;
const Product=db.Product;
const Op=db.Sequelize.Op;


exports.Create=(req,res) => {
      //when we create a cart its just like we are just initializing an empty cart with the cost  0 which means there are no products in the cart 
      const cart={
            id:req.UserId
      }
      
      Cart.create(cart).then((cart)=>{
            res.status(201).send(cart);
      }).catch((err) => {
            res.status(500).send({
                  message: err.message
            });
      })
}

exports.getCart=(req, res) => {
    Cart.findByPk(req.params.id).then((cart)=>{
          //so after finding the finding the cart using the id
          var cost=0;
          var selected_products=[];
          cart.getProducts().then((products)=>{
                for(var i=0; i<products.length;i++) {
                      selected_products.push({
                            id:products[i].id,
                            name:products[i].name,
                            cost:products[i].cost
                      });
                      cost+=products[i].cost;
                }
                res.status(200).send({id:cart.id,selected_products:selected_products,cost:cost});
          }).catch((err)=>{res.status(500).send({message:err.message})})
         
    }).catch((err)=>{res.status(500).send({message:err.message})})
}

exports.update=(req,res)=>{
      //here we are going to add products to the cart which means we are going to increase the cost value
      var cartId=req.params.id;//we will be sending a cart Id to which we are going to add products
      Cart.findByPk(cartId).then((cart)=>{
            //so inside the cart we are going to add products that are passed in as body
            var productIds=req.body.productIds;
            Product.findAll({
                  where:{id:{
                        [Op.or]:productIds
                  }
                   
                  }
            }).then((products)=>{
                    if(!products)
                    {
                       res.status(400).send({message:"There are no products available with the given ids"});
                    }
                    else{
                          //if there are products that are available with the given ids we need to add those products price into the cost of the cart
                          // cart and products are many to many so we need to the products for this cart like this
                          cart.setProducts(products).then(()=>{
                               console.log("Products================================================================================================"+products);
                                console.log("New Products (whose ids that we passed) are successfully added to the cart.......................................................................");
                                var cost=0;//this is going to keep track of the overall cost of the 
                                var selected_products=[];
                                cart.getProducts().then((cartProducts)=>{
                                      //so after setting the products with the (new product ids,old products that are in the cart already) and when we try to get those products we get products that are both previously present and newly added
                                      console.log("cartProducts length: " + cartProducts.length+"........................................................................................");
                                      for(var i=0; i<cartProducts.length; i++)
                                     {
                                           selected_products.push({
                                                 name:cartProducts[i].name,
                                                 id:cartProducts[i].id,
                                                 cost:cartProducts[i].cost
                                           });
                                           cost+=cartProducts[i].cost;
                                     }
                                     res.status(200).send({
                                          id:cart.id,
                                          selected_products:selected_products,
                                          cost:cost
                                    });
    
                                }).catch((err)=>{res.status(500).send({message:err.message})})
                               
                          })
                    }
            }).catch((err)=>{
                res.status(500).send({message: err.message});
            })
      })
}