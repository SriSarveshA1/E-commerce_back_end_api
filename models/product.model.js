module.exports=(sequelize,Sequelize)=>{

    //create this product category
    const Product=sequelize.define('Product',{
        
      id:{
          type:Sequelize.INTEGER,
          primaryKey:true,
          autoIncrement:true
      },
      name:{
          type:Sequelize.STRING,
          allowNull:false
      },
      description:{
          type:Sequelize.STRING,
        
      },
      cost:{
          type:Sequelize.FLOAT,
          allowNull:false
      }


    })

    return Product;

}