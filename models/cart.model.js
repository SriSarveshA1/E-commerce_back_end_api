
module.exports =(sequelize,Sequelize)=>{
  
    const Cart=sequelize.define('Cart',{
        id:{
            type:Sequelize.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
         //Intially these values will be null and it will be updated later
        noOfItems:{
            type:Sequelize.INTEGER
        },
        cost:{
             type:Sequelize.INTEGER,
             defaultValue:0
        }

    });
    return Cart;
}