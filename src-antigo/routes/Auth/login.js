const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


 //MODELS
const User =require('../../database/models/User')
const app = express()

//LOGIN
module.exports = app.post('/',async (req,res)=>{
                                              
    
    const {email,password} = req.body;
    if(!email || !password) return res.status(400).send({error:'Por favor, preencha todos os campos'});
    //login USUARIO EXISTE?
    const user =await User.findOne({email})
    if(!user) return res.status(400).send({error:'Usuário não existe'});

    //CHECA SENHA CORRETA
    const checkPass =await bcrypt.compare(password,user.password)

    if(!checkPass) return res.status(400).send({error:'Senha incorreta'})
    //CRIA UM TOKEN
    const secret = process.env.SECRET
    const token = jwt.sign({id:user._id},secret)
    res.status(200).send({msg:'Login efetuado com sucesso','token' : token})
})