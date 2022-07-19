//here we write the logic to mock the request and response object

//so instead of getting the request object from client we are mocking its functionality 
//same for response ,instead of sending the original response we are using this dummy one to verify
module.exports={
    mockRequest: ()=>{
        const req={};
        req.body=jest.fn().mockReturnValue(req);
        req.params=jest.fn().mockReturnValue(req);
        req.query=jest.fn().mockReturnValue(req);
        return req;
    },
    mockResponse: ()=>{
        const res={};
        res.status=jest.fn().mockReturnValue(res);
        res.send=jest.fn().mockReturnValue(res);
        return res;
    }
}   
