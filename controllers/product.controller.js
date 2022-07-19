const db=require('../models/index');
const Product=db.Product;


//for creating product
exports.create=(req,res)=>{
    const data={
        name:req.body.name,
        description:req.body.description,
        cost:req.body.cost,
        CategoryId:req.body.CategoryId

    };
    Product.create(data).then((Data)=>{
        res.status(200).send(Data);
    }).catch((err)=>{
       // console.log("gopaal");
        res.status(500).send({message:err.message});
    })
}

//for getting all the products and based on query parameters
exports.findAll =(req,res) => {
    const ProductName=req.query.name;
    let promise;
    if(ProductName)
    {
      promise=Product.findAll({where: {name:ProductName}});
    }
    else{
        promise=Product.findAll();
    }
    promise.then((Data)=>{res.status(200).send(Data)}).catch((err)=>{res.status(500).send(err)});
}

exports.findOne=(req,res)=>{
    const ProductId=req.params.id;
    Product.findByPk(ProductId).then((datas)=>{res.status(200).send(datas)}).catch((err)=>{res.status(500).send(err.message)});
}

//for updating the  product
exports.update=(req,res)=>{
    const data={
        id:req.params.id,
        name:req.body.name,
        description:req.body.description,
        cost:req.body.cost
    };
    Product.update(data,{where:{id:req.params.id},returning:true}).then(()=>{
        Product.findByPk(req.params.id).then((data)=>{
            if(!data)
            {
                res.status(500).send("Product with given id is not found")
            }
            res.status(201).send(data)
        }).catch((err)=>{res.send(err.message)});
    }).catch((err)=>{message:err.message});
}

//for deleting the product

exports.delete=(req,res)=>{
             //destroy
    console.log("sds")
    Product.destroy({where:{id:req.params.id}}).then((result)=>{res.send("DELETED SUCCESSFULLY")}).catch((err)=>{res.send(err.message)});
}


