const {mockRequest,mockResponse}=require("../interceptor");
const authController=require("../../../controllers/authController");//since we are trying to test the behaviour of the functions of auth controller 
                                                                    //so we are going to mock the implementation of all the external dependencies these functions depends on.
const  newUser=require("../mockData/newUser.json");     
const db=require("../../../models/index") ;
const User=db.User;
const Role=db.Role;             


//here we are going to perform the auth controller methods

/*
1.Successfull sign up:
  1.a when we provide roles to the user here the roles may be passed by the user
  1.b When we provide the default roles to the user (since the roles are not passed)

2.sign up failed:
*/
var req,res;
//prep work that is to be done before each time the test() or describe() or it() is called
beforeEach(()=>{ //so here before each time test is called we store the req and res object from the mock 
    req=mockRequest();
    res=mockResponse();
})


describe('Testing the sign up method of auth controller', () => {
    it("Successfull sign up ,when we provide roles to the user",async ()=>{
          req.body=newUser;
          //so here we need to mock the implementation of all the model related calls (User ,Role models that is involved in signup)
          
          const resFromCreate={  //so when ever we want to make sure that a function inside another function to return promise we used to pass an object that has function that returns resolved promise
            setRoles:async()=>Promise.resolve()//we need to pass async because the above function User.create takes some time to execute
          };
          const spyOnCreate=jest.spyOn(User, 'create').mockImplementation(()=>//spy on allows you to spy on a function, observe interactions, and mock them accordingly
              //so this User.create will return promise and also if the user.create is successful promise it also does setting roles which is returnin another promise
              //so the resFromCreate has a object that has setRoles which has resolved promise (it has async before it because the user.create function takes some time)
              Promise.resolve(resFromCreate)//so we want the user.create promise to be successfull and also the the promise that setRoles(which is inside the user.create promise) to be successfull
             //Here the setRoles is a user (sequelize object )functtion which we will get only if the user is created successfully thats y we pass this promise inside the outer promise
          );
          const spyOnFindAll=jest.spyOn(Role,'findAll').mockImplementation(()=>//spy on allows you to spy on a function, observe interactions, and mock them accordingly
              Promise.resolve()
          );
          
          await authController.signup(req,res);//so this part will call the actual signup method with mocked req,res objects and the mocked functionalities of User.create,user.setRoles,Role.findAll
          
          await expect(spyOnCreate).toHaveBeenCalled();
          await expect(spyOnFindAll).toHaveBeenCalled();
          await expect(User.create).toHaveBeenCalled();
          await expect(Role.findAll).toHaveBeenCalled();
          
          expect(res.status).toHaveBeenCalledWith(201);
          expect(res.send).toHaveBeenCalledWith("User successfully registered");


    });
    /*
    it("Successfull sign up ,when we dont provide roles to the user(providing the default roles to the user)",()=>{
      //we write the logic to test 
    });
    it("Sign up failed)",()=>{
      //we write the logic to test 
    });
  */
  });
  
  
  
   