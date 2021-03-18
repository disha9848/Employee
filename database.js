const { Sequelize } = require('sequelize');
const sequelize= new Sequelize('employeeDetails','user','password',{
    dialect: 'sqlite',
    host: './dev.sqlite'
});


module.exports = sequelize;