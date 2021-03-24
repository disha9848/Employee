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
    const users= await methods.getUserByName(event.body.name);
    callback(null,users);
  
};

module.exports.getEmployeesById = async (event, context, callback) => {
    const user= await methods.getUserById(event.params.id);
    callback(null,users);
  
};

module.exports.EmployeeLogin = async (event, context, callback) => {
    const response= await methods.userLogin(event.body.password,event.body.email);
    callback(null,users);
  
};

module.exports.addEmployee = async (event, context, callback) => {
    const response= await methods.addUser(event.body.username,event.body.role,event.body.email, event.body.password,event.token);
    callback(null,users);
  
};

module.exports.addEmployeeAddress = async (event, context, callback) => {
    const response= await methods.addAddress(event.body.employeeDetailId,event.body.address1,event.body.city, event.body.state,event.body.country,event.body.pincode);
    callback(null,users);
  
};

module.exports.updateEmployee = async (event, context, callback) => {
    const user =await methods.updateUser(event.params.id,event.body.username, event.body.email,event.token);
    callback(null,users);
  
};

module.exports.deleteEmployee = async (event, context, callback) => {
    const user =await methods.deleteUser(event.params.id,event.token);
    callback(null,users);
  
};

module.exports.verifyToken = async (event, context, callback) =>{
    //get auth header value
    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader !== 'undefined'){
        const bearer=bearerHeader.split(' ');
        const bearerToken= bearer[1];
        event.token=bearerToken;
        next();
    }else{
        callback(null,sendStatus(403))
    }
}

app.listen(3008, () => {
    console.log("App is running");
});
