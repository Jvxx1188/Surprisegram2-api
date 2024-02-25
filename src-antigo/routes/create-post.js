const express = require('express')
const app = express()
const os = require("os");
const path = require('node:path')

const formData = require("express-form-data");

  app.use(formData.parse({uploadDir : os.tmpdir(),autoClean : true}));
  app.use(formData.format());
  app.use(formData.union());

  module.exports = app.post('/',async (req,res)=>{
    
    //verificar se chegou o tittle a fazer ação caso tenha chego o tittle
    
    //verificar se a imagem chegou, se chegou fazer upload no cloudnary e depois me devolver a url
    //verificar se chegou a photo e fazer ação caso tenha chego a foto
    //pegar a imagem em formdata,tittle,ischild,usertoken
    
    

    console.log(req.body)
    return res.send({msg:'Post criado com sucesso'})
    //pegar o id dentro do token
})