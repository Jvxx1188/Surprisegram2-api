//oque vamos fazer, qual a meta, qual o objetivo
//criar um token jwt e tentar acessar uma rota privada com ele
//REQUIRES
require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const app = express()
//ENV
const mongoUser = process.env.DBUSER;
const mongoPass = process.env.DBPASS
//MODELS
const User =require('./database/models/User')
 
//CONNECTION DATABASE
mongoose.connect(`mongodb+srv://${mongoUser}:${mongoPass}@database.6f1mezu.mongodb.net/`).then(() => {
    console.log('MongoDB connected')

    app.listen(5000, () => {
        console.log('Server running on port 5000')
    })
}).catch((err) =>  {
    console.log(err) 
})
app.use(express.json())

//REGISTER
app.post('/auth/register', async (req,res) =>{
    const {name,email,password,confirmPassword} =await req.body;
    //credenciais são nulas?
    if(!name || !email || !password || !confirmPassword) return res.status(400).send({error:'Por favor, preencha todos os campos'});
    //senha igual a confirmação?
    if(password !== confirmPassword) return res.status(400).send({error:'As senhas não conferem'});
    //usuario existe?
    const userExists = await User.findOne({email})
    if(userExists) return res.status(400).send({error:'Usuário ja existe'});
    const salt =await bcrypt.genSalt(12)
    const HashPassword =await bcrypt.hash(password,salt)
    //TUDO FUNCIONANDO, USUARIO CRIADO E PODE SER AUTENTICADO
    const user =await User.create({
        name,
        email,
        password : HashPassword
    }) 
    res.status(201).json({msg : 'usuario criado'})
})


app.post('/auth/login',async (req,res)=>{

    return res.status(200).send({msg:'Login efetuado com sucesso'})                                                                                                             
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
    res.status(200).send({msg:'Login efetuado com sucesso',token})
})

function verifyjwt(req,res,next){
    const token = req.headers.authorization;
    const split = token.split(' ')
    console.log(split[1])   
    const valid = jwt.verify(split[1],process.env.SECRET)
    if(!valid) return res.status(401).send({error:'Token inválido'})
    next()
}
app.get('/',verifyjwt,async (req,res,next) =>{
    console.log(req.headers)
    next()
    
},(req,res)=>{
    res.send('Hello World')
})
//criar pagina de registro 
//criar pagina de login 
//enviar token de response para usuario
//criar rota privada 
//tentar entrar nessa rota usando esse token
