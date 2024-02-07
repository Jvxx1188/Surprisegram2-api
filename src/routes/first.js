const express = require('express')
const app = express()

module.exports = app.get('/',async (req,res,next) =>{
    console.log(req.headers)
    next()
    
},(req,res)=>{
    res.send('Hello World')
})