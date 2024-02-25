const express = require('express')
const userModel = require('../database/models/User')
const jwt = require('jsonwebtoken')
const app = express()
module.exports = app.get('/',async (req,res)=>{
//passou da verificação, o token existe e é valido! prosseguiremos


const token = req.headers.authorization.split(' ');
const tokenObject =await jwt.decode(token[1])
const {id} = tokenObject;

const user = await userModel.findOne({_id : id})
console.log(user, id)

res.status(200).json({
    user : {
        username : user.username,
        email : user.email
    }
})
})