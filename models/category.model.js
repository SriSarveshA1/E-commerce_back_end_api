module.exports=(sequelize,Sequelize)=>{
    const Category=sequelize.define('Category',{//table name will be categories as a plural(as its resource) and sequelize does this
        id:{
            type:Sequelize.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        name:{
            type:Sequelize.STRING,
            allowNull:false
        }
        ,
        description:{
            type:Sequelize.STRING
        }

    });
    return Category;
}