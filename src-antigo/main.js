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

/////////////////////////

const routeGetMyUser = require('./routes/get-my-user')
app.use('/get/user',verifyjwt,routeGetMyUser)

const getRecentPostsRoute = require('./routes/get-recent-posts')
app.use('/',verifyjwt,getRecentPostsRoute)

const addPostRoute = require('./routes/create-post')
app.use('/post',verifyjwt,addPostRoute)




//CONNECTION DATABASE
mongoose.connect(`mongodb+srv://${mongoUser}:${mongoPass}@database.6f1mezu.mongodb.net/`).then(() => {
    console.log('MongoDB connected')

    app.listen(5000, () => { 
        console.log('Server running on port 5000')
    })
}).catch((err) =>  {
    console.log(err) 
})
