const constants=require("../constants/constants");
module.exports=(sequelize,Sequelize)=>{
    const Order=sequelize.define('Order',{
        id:{
            type:Sequelize.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        total_no_items:{
            type:Sequelize.INTEGER
        },
        total_price:{
            type:Sequelize.INTEGER
        },
        order_status:{
            type:Sequelize.ENUM(constants.DELIVERED,constants.DISPATCH,constants.ORDER_PLACED,constants.READY),
            defaultValue:constants.ORDER_PLACED
        }
        //USER_ID will be added once we set up user.hasMany orders relationship(one order belong to one user).

    });

    return Order;
}