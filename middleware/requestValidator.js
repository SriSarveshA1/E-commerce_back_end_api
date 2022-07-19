//so here we try to validate the request body whether it matches the criteria
const db=require('../models/index');
const Category=db.Category;
const validateCategoryRequest=(req,res,next) => {
    if(!req.body.name)
    {
        return res.status(400).send({message:"Name of the category is not specified....>>."});
    }
    if(!req.body.description)
    {
        return res.status(400).send({message:"Description of the category is not specified.>>.."});   
    }
    //if everything is passed we move to controller middleware
    next();
}

const validateProductRequest=(req,res,next) =>{
    if(!req.body.name)
    {
        return res.status(400).send({message:"Name of the product is not specified"});
    }
    if(!req.body.description)
    {
        return res.status(400).send({message:"Description of the product is not specified!!!"});   
    }
    
    if(req.body.cost==null||req.body.cost<=0)
    {
        return res.status(400).send({message:"Please provide valid cost/provide the cost value dont leave it empty"});   
    }
    if(!req.body.CategoryId){
        return res.status(400).send({message:"Category Id  of the product is not specified"}); 
    }
    if(req.body.CategoryId)
    {
       var id=req.body.CategoryId;
       Category.findByPk(id).then((category)=>{
           if(!category)
           {
               return res.status(400).send({message:"Provided category id is not available"});
           }
           
       })
    }
    
   
    next();
} 

module.exports ={
 validateCategoryRequest,validateProductRequest
}