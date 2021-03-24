const express= require('express');
const methods= require('./methods');

const app=express();
app.use(express.json());

module.exports.getEmployees = async (event, context, callback) => {
    const users= await methods.getAllUsers();
    console.log(users)
    callback(null,users);
  
};

module.exports.getEmployeesByName = async (event, context, callback) => {
    const users= await methods.getUserByName(req.body.name);
    callback(null,users);
  
};

module.exports.getEmployeesById = async (event, context, callback) => {
    const user= await methods.getUserById(req.params.id);
    callback(null,users);
  
};

module.exports.EmployeeLogin = async (event, context, callback) => {
    const response= await methods.userLogin(req.body.password,req.body.email);
    callback(null,users);
  
};

module.exports.addEmployee = async (event, context, callback) => {
    const response= await methods.addUser(req.body.username,req.body.role,req.body.email, req.body.password,req.token);
    callback(null,users);
  
};

module.exports.addEmployeeAddress = async (event, context, callback) => {
    const response= await methods.addAddress(req.body.employeeDetailId,req.body.address1,req.body.city, req.body.state,req.body.country,req.body.pincode);
    callback(null,users);
  
};

module.exports.updateEmployee = async (event, context, callback) => {
    const user =await methods.updateUser(req.params.id,req.body.username, req.body.email,req.token);
    callback(null,users);
  
};

module.exports.deleteEmployee = async (event, context, callback) => {
    const user =await methods.deleteUser(req.params.id,req.token);
    callback(null,users);
  
};

module.exports.verifyToken = async (event, context, callback) =>{
    //get auth header value
    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader !== 'undefined'){
        const bearer=bearerHeader.split(' ');
        const bearerToken= bearer[1];
        req.token=bearerToken;
        next();
    }else{
        callback(null,sendStatus(403))
    }
}

app.listen(3008, () => {
    console.log("App is running");
});