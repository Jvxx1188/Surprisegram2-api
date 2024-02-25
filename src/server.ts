import fastify from "fastify";
import { prisma } from "./lib/prisma";
import fastifyJwt from "@fastify/jwt"
import dotenv from 'dotenv'
import { getMyUser } from "./routes/get/get-my-user-information";
import { register } from "./routes/public/register";
import { login } from "./routes/public/login";
import cors from '@fastify/cors'
import { createPost } from "./routes/post/create-post";
import {v2} from 'cloudinary'


dotenv.config()

//cloudnary config
v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET

  })

const jwtSecret =process.env.SECRET;
const app = fastify();


app.register(cors,{
    origin: '*'
})
//registers
app.register(getMyUser)
app.register(register)
app.register(login)
app.register(createPost)


    if(!jwtSecret){
        console.error("A variável de ambiente SECRET não está definida.");
        process.exit(1); 
    }
    app.register(fastifyJwt,{
        secret : jwtSecret
    })
    app.listen({port:5000}).then(() => {
        console.log('HTTP Server running on http://localhost:3333')
    })
