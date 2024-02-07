const express = require('express')
const app = express()
const os = require("os");
const path = require('node:path')

const formData = require("express-form-data");

  app.use(formData.parse({uploadDir : os.tmpdir(),autoClean : true}));
  app.use(formData.format());
  app.use(formData.union());

  module.exports = app.post('/',async (req,res)=>{
    
    let postFormat = {}

    //verificar se chegou o tittle a fazer ação caso tenha chego o tittle
    if(req.body.tittle) post.tittle = req.body.tittle
    //verificar se a imagem chegou, se chegou fazer upload no cloudnary e depois me devolver a url
    //verificar se chegou a photo e fazer ação caso tenha chego a foto
    //pegar a imagem em formdata,tittle,ischild,usertoken
    
    


    return res.send(post)
    //pegar o id dentro do token
})