module.exports={
    HOST: 'localhost',//it specifies where the database is located
    DB:'ecommerce',
    USER: 'root',
    PASSWORD: '3612',
    dialect: 'mysql',//It specifies the connector library that will be used by the sequelize for connecting to a particular database (since we are using mysql database it is mysql)
    pool:{
        max:5,//max threads so only 5 connections can be established at a time
        min:0,
        acquire:30000,//maximum a connection establishment will try to establish within 30000 milli seconds
        idle:1000//connection if its idle for 1000 milli seconds without making any request then the connections establishment will be released
    }
}
