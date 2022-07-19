
module.exports =(sequelize,Sequelize)=>{
  
    const Cart=sequelize.define('Cart',{
        id:{
            type:Sequelize.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
        cost:{
             type:Sequelize.INTEGER,
             defaultValue:0
        }
    });
    return Cart;
}