const express= require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const sequelize=require('./database');
const employeeDetails = require('./employeeDetails');
const address = require('./address');

sequelize.sync().then(() => console.log('db is ready'));

const app=express();
app.use(express.json());

//Associations

app.get('/employees', async (req,res) => {
    const users= await employeeDetails.findAll();
    res.send(users);
});

app.get('/employees/names', async (req,res) => {
    const users= await employeeDetails.findAll({ where: { username: req.body.name}});
    res.send(users);
});

app.get('/employees/:id', async (req,res) => {
    const requestedId=req.params.id;
    const user= employeeDetails.findByPk(requestedId, {include : [employeeDetails.hasMany(address)]}).then((emp) => {
        console.log(emp.toJSON())
    }).catch((err) => {
        console.log("Error while find address of employee : ", err)
      })
    res.send(user);
});

app.post('/login', async (req,res) => {
    const employee = {
        password: req.body.password,
        email: req.body.email
    }
    const user = await employeeDetails.findOne({ where: { email: employee.email}});
    if(user==null){
        //res.send("User not found")
        jwt.sign({user}, 'secretkey',{ expiresIn: '30m' }, (err,token) => {
            res.json({
                token
            });
        });
    }
    if(user.role=="admin"){
        if(bcrypt.compareSync(employee.password, user.password)){
            jwt.sign({user}, 'secretkey',{ expiresIn: '30m' }, (err,token) => {
                res.json({
                    token
                });
            });
        }else{
            res.send("Wrong password")
        }
    }else{
        res.send("User is not an admin")
    }
})

app.post('/employees', verifyToken ,async (req,res) => {
    jwt.verify(req.token, 'secretkey', (err) => {
        if(err){
            res.sendStatus(403);
        }else{       
            let saltRounds=10;
            const salt = bcrypt.genSaltSync(saltRounds);
            const hashpassword = bcrypt.hashSync(req.body.password, salt);
            req.body.password=hashpassword;
            employeeDetails.create(req.body)
            res.send('user is inserted');
        }
    });
});

app.post('/employees/address' , async (req,res) => {
    address.create(req.body)
    res.send('address is inserted');
});


app.put('/employees/:id', verifyToken ,async (req,res) => {
    const requestedId=req.params.id;
    const user =await employeeDetails.findOne({ where: { id: requestedId}});
    jwt.verify(req.token, 'secretkey', (err) => {
        if(err){
            res.sendStatus(403);
        }else{       
            user.username=req.body.username;
            user.email=req.body.email;
            user.save();
            res.send('Updated');
        }
    });
});

app.delete('/employees/:id', verifyToken ,async (req,res) => {
    jwt.verify(req.token, 'secretkey', (err) => {
        if(err){
            res.sendStatus('token error');
        }else{
            console.log('reached here')
            const requestedId=req.params.id;
            employeeDetails.destroy({where: { id: requestedId}});
            res.send('user is removed');
        }
    });
});

function verifyToken(req, res, next){
    //get auth header value
    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader !== 'undefined'){
        const bearer=bearerHeader.split(' ');
        const bearerToken= bearer[1];
        req.token=bearerToken;
        next();
    }else{
        res.sendStatus(403)
    }
}

app.listen(3000, () => {
    console.log("App is running");
});
