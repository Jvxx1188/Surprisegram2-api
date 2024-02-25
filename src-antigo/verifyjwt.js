

const jwt = require('jsonwebtoken')

module.exports = (req,res,next) =>{
    const token = req.headers.authorization;
    if(!token) return res.status(401).send({error:'Token não existe'})
    
    const split = token.split(' ')  
    const valid = jwt.verify(split[1],process.env.SECRET)
    if(!valid) return res.status(401).send({error:'Token inválido'})
    next()
}