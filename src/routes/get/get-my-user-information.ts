import { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma"
import {z} from 'zod'
import { jwtValidation } from "../../lib/jwtValidation";

export async function getMyUser(app : FastifyInstance){
app.get('/get/user',async (request,reply) => {
  //validação jwt e retorno dele em objeto
const jwt = await jwtValidation(app,request,reply)
//pegar o jwt object

//verificar se o user existe
  const userExists = await prisma.user.findUnique({
    where : {
        id : jwt.sub
    }
  })
  if(!userExists) return reply.status(400).send({error:'user not found',jwt :true});

  const {email,username} = userExists;

  const userInformation = {
    email,
    username
  }

  return userInformation
})
}