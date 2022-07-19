const { mockRequest, mockResponse } = require("../interceptor");
const newCategory = require("../mockData/newCategory.json");
const Category = require("../../../models").Category;
const categoryController = require("../../../controllers/category.controller");


/**
 * I need to test the functionality of creating Category
 */

/**
 * Before the testing is done, we need to have the req and res objects
 * 
 * Normally req and res, will be passed by route layer, but here since there is no
 * routes, we need to create mock req and resp.
 * 
 * Mocked req and resp is provided by inteceptor.js file
 */
let req, res;
beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
})

describe("Teating create category method", () => {

    it('test successfull creation of a new category',async () => {

        //For creating the category, req should have a body
        req.body = newCategory

        //Mock and spy on Category create method
        const spy = jest.spyOn(Category, 'create').mockImplementation((newCategory) => Promise.resolve(newCategory));
        
        //Execute the create method

        await categoryController.create(req, res);

        //Validation

        //I will expect spy to be called
        expect(spy).toHaveBeenCalled();
        // I will expect Category create method to be called
        expect(Category.create).toHaveBeenCalledWith(newCategory);
        // res status should be set to 201
        expect(res.status).toHaveBeenCalledWith(201);
        // res send is sending the newCategory
        expect(res.send).toHaveBeenCalledWith(newCategory);
 
    });

    /**
     * Testing the failure scenario
     */
    it("test failure during the  creation of a new category",async ()=>{
         //For creating the category, req should have a body
         req.body = newCategory;

         //Mock and spy on Category create method
         const spy = jest.spyOn(Category, 'create').mockImplementation(() => Promise.reject(Error("Error while creating category")));//we Want the mock implementation of the Category.create to give promise.reject during the failing scenario.
         
         //Execute the create method
 
         await categoryController.create(req, res);

 
         //Validation
 
         //I will expect spy to be called asyc way as all the lines of the code below this should execute later only after we checked whether the spying is done properly
         await expect(spy).toHaveBeenCalled();//So this spy keeps on spying this Category.create mocked method so when ever its used we check whether its used and we want all the bellow lines of code to exectute after this line ,as all the below code depends on the mock implementation function
      
         expect(Category.create).toHaveBeenCalledWith(newCategory);
         
         expect(res.status).toHaveBeenCalledWith(500);
        
         expect(res.send).toHaveBeenCalledWith({message:"error while creating category"});
    })


})

describe("Testing the findAll method", ()=>{
    it("Test the findAll method when no query has been provided",async ()=>{

        //Mock and spy the Category.findAll method
        const spy=jest.spyOn(Category,'findAll').mockImplementation(()=>Promise.resolve(newCategory));//so when we see the actual implementation in the successfull promise resolve in the then((parameter)=>{}) so we are setting that value as newCategory.
        //So here in the general findAll method we return all the Categories but we just replaced the then((parameter)=>{}) parameter with the newCategory so that will be returned in send also 

        //We are invoking the method
        await categoryController.findAll(req,res);

        //validations
       await expect(spy).toHaveBeenCalled();//Checking whether the spying is done or not (we want this to asynchronously run)
       expect(Category.findAll).toHaveBeenCalled();
       expect(res.status).toHaveBeenCalledWith(200);
       expect(res.send).toHaveBeenCalledWith(newCategory);//So here in the Category.findAll we are returning the object of data of the newCategory only so here we are just cross checking






    })
    it("Test the findAll method when there is a query is passes",async ()=>{
         //so since here there is a query paramter name to which we pass some value
         //And if that query param has a value we want the findAll method to get executed in the if(req.query.name) is true
         //Inside that there is a findAll method which has the object with where condition and that Category.findAll({where:{name:"Random"}}) gets executed
        const queryParam={
            where:{
                name:"Random"
            }
        };
        req.query={  //This is syntax of defining the new parameter with value to the req.query parameter
            name:"Random"
        };
        /*
           inside the Category.controller.js  

            const categoryName=req.query.name; //So when we define the query param while like above.. thats how we can retive here
            let promise;
           if(categoryName)
           {
             //if valid string is entered in between name query parameter
         
           promise=Category.findAll({
            where: {name: categoryName}
           });
         }

         */
        const spy=jest.spyOn(Category,'findAll').mockImplementation(()=>Promise.resolve(newCategory));//But once the Category.findAll method is called we only want the promise to be successfull and inside the then((newCategory)=>{//is called})
        await categoryController.findAll(req,res);

        await expect(spy).toHaveBeenCalled();
        expect(Category.findAll).toHaveBeenCalledWith(queryParam);//so we check whether that Category.findAll is called with {where:{name:"Random"}} //so we can make sure that this part is called with query param as name="random"
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(newCategory);

    })

})

describe("Testing the Update method",()=>{
    it("Test the update method",async ()=>{
      req.body=newCategory;
      req.params={
          id:1
      }
      const spyOnUpdate=jest.spyOn(Category,"update").mockImplementation(()=>Promise.resolve(newCategory));
      const spyOnFindByPk=jest.spyOn(Category,"findByPk").mockImplementation(()=>Promise.resolve(newCategory));

      await categoryController.update(req,res);
      await expect(spyOnUpdate).toHaveBeenCalled();
      await expect(spyOnFindByPk).toHaveBeenCalled();
      expect(Category.findByPk).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
        expect(res.send).toHaveBeenCalledWith(newCategory);
    })
})

