const { Model, DataTypes }= require('sequelize');
const sequelize=require('./database');

 class address extends Model {}

 address.init({
     employeeAddress:{
         type: DataTypes.STRING
     },
     employeeDetailId:{
         type: DataTypes.INTEGER
     }
     
 },{
     sequelize,
     modelName: "address"
 });
 address.associate = function(models) {
    address.belongsTo(models.employeeDetails, {foreignKey: 'employeeDetailId',as: 'employee',through: 'employees'})
  };

 module.exports=address;