const express = require('express')
const bcrypt = require('bcrypt')
const app = express()

//MODELS
const User =require('../../database/models/User')

//REGISTER
module.exports = app.post('/', async (req,res) =>{
    const {username,email,password,confirmPassword} =await req.body;
    //credenciais são nulas?
    if(!username || !email || !password || !confirmPassword) return res.status(400).send({error:'Por favor, preencha todos os campos'});
    //senha igual a confirmação?
    if(password !== confirmPassword) return res.status(400).send({error:'As senhas não conferem'});
    //usuario existe?
    const userExists = await User.findOne({email})
    if(userExists) return res.status(400).send({error:'Usuário ja existe'});
    const salt =await bcrypt.genSalt(12)
    const HashPassword =await bcrypt.hash(password,salt)
    //TUDO FUNCIONANDO, USUARIO CRIADO E PODE SER AUTENTICADO
    const user =await User.create({
        username,
        email,
        password : HashPassword
    }) 
    res.status(201).json({msg : 'usuario criado'})
})
