module.exports=(sequelize,Sequelize)=>{
    const User=sequelize.define('User',{
        //for understanding purpose we are not going to give id coloumn manually and id column will be created automatically
        username:{
            type:Sequelize.STRING
        },
        email:{
            type:Sequelize.STRING
        },
        password:{
            type:Sequelize.STRING
        }
    });
    return User;
}
