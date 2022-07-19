const db=require('../models/index');
const Category=db.Category;


//for posting a data 
exports.create=(req,res) => {

    const data={
        name:req.body.name,
        description:req.body.description
    }
    Category.create(data).then((catData)=>{
        res.status(201).send(catData);
    }).catch((err)=>{
        res.status(500).send({message:"error while creating category"});
    })

};


//for getting category based on id
exports.findOne=(req,res)=>{

    //findByPk we can just pass the id alone as a value
    const categoryId=req.params.id;
    Category.findByPk(categoryId).then((category)=>{
        res.status(200).send(category);
    })
    .catch(err=>{
        res.status(500).send(err.message);
    })
}
//for getting category based on name (query params)
exports.findAll=(req,res) => {
    const categoryName=req.query.name;
   
    let promise;
    if(categoryName)
    {
         //if valid string is entered in between name query parameter
         console.log("......................................................................................................................");
        promise=Category.findAll({
            where: {name: categoryName}
           });
    }
    else{
        //if name query params is not passed or if empty string is passed in the name query params
        promise=Category.findAll();//that time we return all the categories

    }

    promise.then((categories)=>{
        res.status(200).send(categories);
    })
    .catch((err)=>{
        res.status(500).send(err.message);
    })
   
}
//for deleting the category based on id
exports.delete=(req, res)=>{
    const CategoryId =req.params.id;
    Category.destroy({
        where:{
            id:CategoryId
        }
    }).then(()=>{res.send("Data is deleted successfully")}).catch(()=>{res.send("Error")})
}
//for updating the category based on the id

exports.update=(req,res)=>{
    const category = {
        id: req.params.id,
        name: req.body.name,
        description: req.body.description
    }
    Category.update(category,
        {
            where: {id: category.id},
            returning:true
        }
    ).then(()=>{
        //here we need to get the content from another findByPk method where we pass id
        Category.findByPk(category.id).then((category)=>{res.status(201).send(category)}).catch((err)=>{res.status(500).send(err.message)});
    }).catch((err)=>{res.status(500).send(err.message)});
}


