module.exports=(sequelize,Sequelize)=>{
    const OrderDetails=sequelize.define('orderDetails',{
        id:{
            type:Sequelize.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
        productId:{
            type:Sequelize.INTEGER,
            allowNull:false
        },
        quantity:{
            type:Sequelize.INTEGER,
            allowNull:false
        }
        //OrderId will be for orderDetails by going order has many orderDetails (but each orderDetails will be belonging to one order).
        

    });
    return OrderDetails;

}