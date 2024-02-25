import { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma"
import {z} from 'zod'
import bcrypt from 'bcrypt'
export async function register(app : FastifyInstance){
    app.post('/auth/register', async (req,res) =>{
    const userBodySchema = z.object({
        username : z.string(),
        email : z.string(),
        password : z.string(),
        confirmPassword : z.string()
    })

    //safeparse teria que ser chamado pra validar ai eu teria que chamalo denovo
        const body = await userBodySchema.safeParse(req.body) ;
        if(!body.success){ return res.status(400).send({error:'Credenciais estão faltando'})}
        

        const {username,email,password,confirmPassword} = body.data

    if(password !== confirmPassword) return res.status(400).send({error:'As senhas precisam ser iguais'});
   
    const userExists = await prisma.user.findUnique({
        where : {
            email
        }
    })

    if(userExists) return res.status(400).send({error:'Usuário ja existe'});
    const salt =await  bcrypt.genSalt(12)
    const HashPassword =await bcrypt.hash(password,salt)
    
    //TUDO FUNCIONANDO, USUARIO CRIADO E PODE SER AUTENTICADO
    
    const userCreated =await prisma.user.create({
        data : {
            username,
            email,
            password : HashPassword,
            userFriendly : true
        }
        }) 

    res.status(201).send({msg : 'usuario criado'})
})
}