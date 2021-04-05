const express= require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const sequelize=require('./database');
const employeeDetails = require('./employeeDetails');
const address = require('./address');

sequelize.sync().then(() => console.log('db is ready'));

const app=express();
app.use(express.json());

async function getAllUsers() {
    const users= await employeeDetails.findAll();
    return users;
}

async function getUserByName(name){
    const users= await employeeDetails.findAll({ where: { username: name}});
    return users;
}

async function getUserById(requestedId){
    const users= await employeeDetails.findByPk(requestedId, {include : [employeeDetails.hasMany(address)]})
    return users;
}

async function userLogin(password,emailId){
    var result;
    const user = await employeeDetails.findOne({ where: { email: emailId}});
    if(user==null){
        result= ("User not found");
    }else{
        if(user.role=="admin"){
            if(bcrypt.compareSync(password, user.password)){
                result = await new Promise((resolve, reject) => {
                    jwt.sign({user}, 'secretkey',{ expiresIn: '30m' }, (err,token) => {
                        console.log(token)
                        if (err) reject(err)
                            resolve(token)
                    });
                })
            }else{
                result= ("Wrong password")
            }
            
        }else{
            result= ("User is not an admin")
        }
    }
    return result;
}

async function addUser(username,role,email,password,token){
    console.log(token)
    let result="";
    const user={
        username: username,
        role: role,
        email: email,
        password: password
    }
    jwt.verify(token, 'secretkey', (err) => {
        if(err){
            console.log(err)
            result= "please authenticate";
        }else{       
            let saltRounds=10;
            const salt = bcrypt.genSaltSync(saltRounds);
            const hashpassword = bcrypt.hashSync(user.password, salt);
            user.password=hashpassword;
            employeeDetails.create(user)
            result= 'user is inserted';
        }
    });
    return result;
}

async function updateUser(Id,name,email,token){
    let result="";
    const user =await employeeDetails.findOne({ where: { id: Id}});
    jwt.verify(token, 'secretkey', (err) => {
        if(err){
            result= ("please authenticate");
        }else{       
            user.username=name;
            user.email=email;
            user.save();
            result= ('Updated');
        }
    });
    return result;
}

async function deleteUser(Id,token){
    let result="";
    jwt.verify(token, 'secretkey', (err) => {
        if(err){
            result= ('token error');
        }else{
            employeeDetails.destroy({where: { id: Id}});
            result= ('user is removed');
        }
    });
    return result;
}

async function addAddress(employeeDetailId,address1,city,state,country,pincode){
    const user= {
        employeeDetailId :employeeDetailId,
        address1: address1,
        city:city,
        state:state,
        country:country,
        pincode:pincode
    }
    address.create(user)
    return ('address is inserted');
}


module.exports = {getAllUsers,getUserByName,getUserById,userLogin, addUser,updateUser,deleteUser,addAddress};
