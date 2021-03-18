const { Model, DataTypes }= require('sequelize');
const address = require('./address');
const sequelize=require('./database');

 class employeeDetails extends Model {}

 employeeDetails.init({
     username: {
         type: DataTypes.STRING
     },
     email:{
        type: DataTypes.STRING
     },
     role:{
        type: DataTypes.STRING
     },
     password:{
        type: DataTypes.STRING
     },
 },{
     sequelize,
     modelName: "employeeDetails"
 });
employeeDetails.associate = function(models) {
    employeeDetails.hasMany(models.address, {as: 'employees',through: 'employees'})
};

 module.exports=employeeDetails;