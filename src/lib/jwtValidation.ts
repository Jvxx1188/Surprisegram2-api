import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify"
import z from "zod";
export async function jwtValidation(app: FastifyInstance,request : FastifyRequest<any>,reply : FastifyReply) {
    const {authorization} = request.headers;
    
   if(!authorization) {
        return  reply.status(401).send({error:'Token inexistente',jwt : true})
        //reset application front
    }

    const jwt = authorization.split(" ").length > 0 ? authorization.split(" ")[1] : authorization
   
    
    const userSchema = z.object({
       email: z.string().email(),
       sub:z.string().uuid(),
       iat:z.number(),
       exp:z.number()
     
   })

   //verificação do jwt com tipagem

   try{
    const user : z.infer<typeof userSchema> =await app.jwt.verify(jwt) 
    return user
   }catch{
   return reply.status(401).send({error:'Token invalido',jwt : true})
   }
   

   
   //verifique se o jwt é valido
}