const express= require('express');
const methods= require('./methods');

const app=express();
app.use(express.json());

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
module.exports.getEmployees = async () => {
    const users= await methods.getAllUsers();
    return formatResponse(200,users)
  
};


module.exports.getEmployeesById = async (event) => {
    console.log(event.pathParameters.id)
    const users= await methods.getUserById(event.pathParameters.id);
    return formatResponse(200,users)
  
};

module.exports.getEmployeesByName = async (event) => {
    console.log(event)
    const users= await methods.getUserByName(event.pathParameters.name);
    return formatResponse(200,users)
  
};

module.exports.EmployeeLogin = async (event) => {
    const body= JSON.parse(event.body)
    const response= await methods.userLogin(body.password,body.email);
    return formatResponse(200,response)
  
};

module.exports.addEmployee =async (event) => {
    console.log(event.headers.Authorization)
    const bearer=event.headers.Authorization.split(' ');
    const bearerToken= bearer[1];
    event.headers.Authorization=bearerToken;
    const body= JSON.parse(event.body)
    const response= await methods.addUser(body.username, body.role, body.email, body.password,event.headers.Authorization);
    return formatResponse(200,response)
  
};

module.exports.addEmployeeAddress =async (event) => {
    const body= JSON.parse(event.body)
    const response= await methods.addAddress(body.employeeDetailId,body.address1,body.city, body.state,body.country,body.pincode);
    return formatResponse(200,response)
  
};

module.exports.updateEmployee =async (event) => {
    console.log(event.headers.Authorization)
    const bearer=event.headers.Authorization.split(' ');
    const bearerToken= bearer[1];
    event.headers.Authorization=bearerToken;
    const body= JSON.parse(event.body)
    const response= await methods.updateUser(event.pathParameters.id,body.username, body.email,event.headers.Authorization);
    return formatResponse(200,response)
  
};

module.exports.deleteEmployee =async (event) => {
    const bearer=event.headers.Authorization.split(' ');
    const bearerToken= bearer[1];
    event.headers.Authorization=bearerToken;
    console.log(event.headers.Authorization)
    const response= await methods.deleteUser(event.pathParameters.id,event.headers.Authorization);
    return formatResponse(200,response)
  
};

const formatResponse = function(statusCode, body) {
    const response = {
        statusCode: statusCode,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json"
        },
        isBase64Encoded: false,
        body: JSON.stringify(body)
    };
    return response;
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(3002, () => {
    console.log("App is running");
});