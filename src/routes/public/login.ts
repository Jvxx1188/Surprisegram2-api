import { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma"
import {z} from 'zod'
import bcrypt from 'bcrypt'
export async function login(app : FastifyInstance){
    app.post('/auth/login', async (req,res) =>{
    const loginBodySchema = z.object({
        email : z.string(),
        password : z.string()
    })

    //safeparse teria que ser chamado pra validar ai eu teria que chamalo denovo
        const body = await loginBodySchema.safeParse(req.body) ;
        if(!body.success){ return res.status(400).send({error:'Credenciais estão faltando'})}
        

        const {email,password} = body.data
   
    const userExists = await prisma.user.findUnique({
        where : {
            email
        }
    })

    if(!userExists) return res.status(400).send({error:'Usuario não existe'});
    

 //CHECA SENHA CORRETA
 const checkPass =await bcrypt.compare(password,userExists.password)

 if(!checkPass) return res.status(400).send({error:'Senha incorreta'})
 //CRIA UM TOKEN
 const token =await app.jwt.sign({
    sub: userExists.id,
    expiresIn: '30d'
  })
    res.status(201).send({msg : 'sucesso, redirecionando...',token})
})
}