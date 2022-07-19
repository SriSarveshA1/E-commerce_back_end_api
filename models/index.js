const Sequelize=require('sequelize');
const config=require('../configs/db.configs');

//db connection establishment
const sequelize=new Sequelize(config.DB,config.USER,config.PASSWORD,{
    host:config.HOST,
    dialect:config.dialect,
    pool:{
        max:config.pool.max,
        min:config.pool.min,
        acquire:config.pool.acquire,
        idle:config.pool.idle
    }
});

const db={};

db.sequelize=sequelize;
db.Sequelize=Sequelize;

//initializing schema
db.Category=require('../models/category.model')(db.sequelize,db.Sequelize);
db.Product=require('../models/product.model')(db.sequelize,db.Sequelize);
db.User=require('../models/user.model')(db.sequelize,db.Sequelize);
db.Role=require('../models/role.model')(db.sequelize,db.Sequelize);
db.ROLES=["customer","admin"];//we store the roles as theese are the constants and we can use these for faster calculations
db.Cart=require('../models/cart.model.js')(db.sequelize,db.Sequelize);

//we are overall setting many to many relationship between Roles and Users(Like one role can be assigned to multiple users and one user can be assigned to multiple roles)
//we start by assigning one to many reltionship between role and user
db.Role.belongsToMany(db.User,{
  through:"User_roles",//The bridge table name that will be created
  foreignKey:"role_Id",//(id from role table is modified(as our wish) called as role_Id) //so automatically from the Role table the foreignKey will be assigned to User_roles where both (first from role table the role_Id acts as foreignKey and in from user table user_id acts as foreignKey)
  otherKey:"user_Id"

});
//then we assign one to many reltionship between user and role
db.User.belongsToMany(db.Role,{
    through:"User_roles",
    foreignKey:"user_Id",//(id from user table is modified(as our wish) as user_id)//so automatically from the User table the foreignKey will be assigned to User_roles
    otherKey:"role_id"
});

db.User.hasMany(db.Cart);//1 user can have multiple carts but a single cart belongs to only user_id

db.Cart.belongsToMany(db.Product,{
    through:"cart_products",
    foreignKey:"cart_Id",
    otherKey:"product_Id"
});

db.Product.belongsToMany(db.Cart,{
    through:"cart_products",
    foreignKey:"product_Id",
    otherKey:"cart_Id"
});

module.exports=db;

