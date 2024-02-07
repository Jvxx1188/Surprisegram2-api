require('dotenv').config() 

const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const app = express()
app.use(cors())
app.use(express.json())

const mongoUser = process.env.DBUSER;
const mongoPass = process.env.DBPASS


//JWT
const verifyjwt = require('./verifyjwt')

//Routes
const routeLogin = require('./routes/Auth/login')
app.use('/auth/login',routeLogin)

const routeRegister = require('./routes/Auth/register')
app.use('/auth/register',routeRegister)

const firstRoute = require('./routes/first')
app.use('/',verifyjwt,firstRoute)

const addPostRoute = require('./routes/addPost')
app.use('/post',addPostRoute)

//CONNECTION DATABASE
mongoose.connect(`mongodb+srv://${mongoUser}:${mongoPass}@database.6f1mezu.mongodb.net/`).then(() => {
    console.log('MongoDB connected')

    app.listen(5000, () => { 
        console.log('Server running on port 5000')
    })
}).catch((err) =>  {
    console.log(err) 
})
