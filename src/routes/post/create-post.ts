import { FastifyInstance, FastifyReply } from "fastify";
import { jwtValidation } from "../../lib/jwtValidation";
import path from 'path'
import fs from 'fs'
import { pipeline } from 'stream'
import { promisify } from 'util'
import multipart from '@fastify/multipart';
import { prisma } from "../../lib/prisma";
import { v2 } from 'cloudinary'
export async function createPost(app: FastifyInstance) {
  app.register(multipart, { limits: { fileSize: 15 * 1024 * 1024 } })

  app.post('/posts/add', async (req, res) => {
    //jwt validation
    console.log('criação de post solicitada')
    const jwt = await jwtValidation(app, req, res)
    console.log('validação confirmada')
    //pega a file

    const file = await req.file() as unknown as any;
    if (!file) return res.status(400).send({ error: 'não foram enviados nenhum arquivo!!' })
    console.log('arquivos encontrados, pegando-os')
    //pega a imagem
    const image = await file.fields.img.file as any
    console.log('vamos checkar a extensão do arquivo')
    //pega a extensão da imagem
    const imageExtensionFile = await path.extname(file.fields.img.filename)
    //pega o title
    let title = await file.fields?.title?.value as string

    if (!title && !image) {
      return res.status(400).send("envie ao menos uma imagem ou texto")
    }
    //cria a imgurl
    if (!title) title = ''
    console.log('vamos checkar a extensão do arquivo')
    await CheckingValidExtensionImage(imageExtensionFile, res)
    console.log('check de extensão confirmado ' + imageExtensionFile)
    console.log('titulo : ' + title)
    //userExists?
    console.log('vamos verificar se o seu usuário é valido e existe')
    const userExists = await prisma.user.findUnique({
      where: {
        id: jwt.sub
      }
    })
    if (!userExists) return res.status(400).send({ error: 'usuario que esta fazendo o post não existe?' })
    console.log('vamos criar o post no banco de dados')
    //cria o post com o titulo com texto ou sem texto e a imagem vazia
    const post = await prisma.post.create({
      data: {
        title,
        imgUrl: '',
        userId: jwt.sub
      }
    })

    //validamos se vem bytes na imagem, significando que contem imagem
    const imageBytes = await image._readableState.length;
    if (imageBytes) {
      console.log('Imagem encontrada, vamos fazer upload')
      //criar o path de onde o arquivo vai ser salvo
      const pathLocation = path.resolve('/tmp/' + post.id + imageExtensionFile)
      //criar fylestream que serve como rota de transferencia
      const filestream = fs.createWriteStream(pathLocation)
      //passar o arquivo por meio dessa fylestream
      const pipe = promisify(pipeline)
      await pipe(image, filestream)
      //faz upload no cloudnary
      await v2.uploader.upload(pathLocation, async (error, result) => {
        if (error) {
          await prisma.post.delete({
            where: {
              id: post.id
            }
          })
          return res.status(400).send('erro ao fazer upload da imagem')
        }
        if (result) {
          await prisma.post.update({
            where: {
              id: post.id
            },
            data: {
              imgUrl: result.url
            }
          })
          fs.unlinkSync(pathLocation)
          return res.status(201).send({ message: 'post criado com sucesso', restart: true });
        }
      })
    }
    console.log('finalizado')
    return res.status(201).send({ message: 'post criado com sucesso', restart: true });
  })
}

function CheckingValidExtensionImage(fileExtension: string, res: FastifyReply) {
  if (fileExtension === '.png' || fileExtension === '.jpg' || fileExtension === '.jpeg' || fileExtension === '.gif' || fileExtension == '') {
    return true
  } else {
    res.status(400).send({ error: 'Extensão do arquivo somente png/jpg/jpeg/gif' })
  }
}
