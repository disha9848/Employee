const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    "employees"  ,
    "localhost",
    "123556", {
    host: "localhost",
    port: 5432,
    dialect: 'postgres',
}
);
sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully');
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err);
    });
module.exports = sequelize;