const express = require('express');
const app = express();
const serverConfig = require('./configs/server.config');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const db=require('./models/index');
//const res = require('express/lib/response');
//Table creation
db.Category.hasMany(db.Product);//creating one to many relationship it should be present before the schema is created
function init(){
    var cat=[
        {
            name: 'elec',
            desc:"This category contains products of elec category"
         },
         {
            name:"stationaries",
            desc:"Has pencills,errasers and so on"

         }
        
    ]
    db.Category.bulkCreate(cat).then(()=>{console.log("Initial categories have been added to database")}).catch(err=>{console.log(err.message)});
    //creating the roles so that we create users based on the roles
    var id1={id:"1"};
    var id2={id:"2"};

    //if at all the roles are not there previously we are creating them
    db.Role.findAll({
        where: {id:id1.id}
    }).then((role)=>{
        if(!role)
        {
            db.Role.create({id:1,name:"customer"}).then(()=>{console.log("Basic role is created")}).catch(err=>{console.log(err)});
        }
    })

    db.Role.findAll({
        where:{id:id2.id}
    }).then((role)=>{
        if(!role)
        {
            db.Role.create({id:2,name:"admin"}).then(()=>{console.log("Basic role is created")}).catch(err=>{console.log(err)});
        }
        
    })
   
}

db.sequelize.sync().then(()=>{
    console.log("table/schema is created");
    init();
}).catch(err => console.log(err));





require('./routes/category.routes')(app);
require('./routes/product.routes')(app);
require('./routes/auth.routes')(app);
require('./routes/cartRoutes')(app);
require('./routes/order.routes')(app);




//so when the api endpoint is not a valid one
app.use((req,res)=>{
    res.status(404).send({message:"Requested End point is not present"});
})




app.listen(serverConfig.PORT,()=>{
    console.log('listening on port',serverConfig.PORT);
});
