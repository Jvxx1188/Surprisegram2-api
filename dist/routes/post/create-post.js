"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPost = void 0;
const jwtValidation_1 = require("../../lib/jwtValidation");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const stream_1 = require("stream");
const util_1 = require("util");
const multipart_1 = __importDefault(require("@fastify/multipart"));
const prisma_1 = require("../../lib/prisma");
const cloudinary_1 = require("cloudinary");
async function createPost(app) {
    app.register(multipart_1.default, { limits: { fileSize: 15 * 1024 * 1024 } });
    app.post('/posts/add', async (req, res) => {
        //jwt validation
        console.log('criação de post solicitada');
        const jwt = await (0, jwtValidation_1.jwtValidation)(app, req, res);
        console.log('validação confirmada');
        //pega a file
        const file = await req.file();
        if (!file)
            return res.status(400).send({ error: 'não foram enviados nenhum arquivo!!' });
        console.log('arquivos encontrados, pegando-os');
        //pega a imagem
        const image = await file.fields.img.file;
        console.log('vamos checkar a extensão do arquivo');
        //pega a extensão da imagem
        const imageExtensionFile = await path_1.default.extname(file.fields.img.filename);
        //pega o title
        let title = await file.fields?.title?.value;
        if (!title && !image) {
            return res.status(400).send("envie ao menos uma imagem ou texto");
        }
        //cria a imgurl
        if (!title)
            title = '';
        console.log('vamos checkar a extensão do arquivo');
        await CheckingValidExtensionImage(imageExtensionFile, res);
        console.log('check de extensão confirmado ' + imageExtensionFile);
        console.log('titulo : ' + title);
        //userExists?
        console.log('vamos verificar se o seu usuário é valido e existe');
        const userExists = await prisma_1.prisma.user.findUnique({
            where: {
                id: jwt.sub
            }
        });
        if (!userExists)
            return res.status(400).send({ error: 'usuario que esta fazendo o post não existe?' });
        console.log('vamos criar o post no banco de dados');
        //cria o post com o titulo com texto ou sem texto e a imagem vazia
        const post = await prisma_1.prisma.post.create({
            data: {
                title,
                imgUrl: '',
                userId: jwt.sub
            }
        });
        //validamos se vem bytes na imagem, significando que contem imagem
        const imageBytes = await image._readableState.length;
        if (imageBytes) {
            console.log('Imagem encontrada, vamos fazer upload');
            //criar o path de onde o arquivo vai ser salvo
            const pathLocation = path_1.default.resolve('/tmp/' + post.id + imageExtensionFile);
            //criar fylestream que serve como rota de transferencia
            const filestream = fs_1.default.createWriteStream(pathLocation);
            //passar o arquivo por meio dessa fylestream
            const pipe = (0, util_1.promisify)(stream_1.pipeline);
            await pipe(image, filestream);
            //faz upload no cloudnary
            await cloudinary_1.v2.uploader.upload(pathLocation, async (error, result) => {
                if (error) {
                    await prisma_1.prisma.post.delete({
                        where: {
                            id: post.id
                        }
                    });
                    return res.status(400).send('erro ao fazer upload da imagem');
                }
                if (result) {
                    await prisma_1.prisma.post.update({
                        where: {
                            id: post.id
                        },
                        data: {
                            imgUrl: result.url
                        }
                    });
                    fs_1.default.unlinkSync(pathLocation);
                    return res.status(201).send({ message: 'post criado com sucesso', restart: true });
                }
            });
        }
        console.log('finalizado');
        return res.status(201).send({ message: 'post criado com sucesso', restart: true });
    });
}
exports.createPost = createPost;
function CheckingValidExtensionImage(fileExtension, res) {
    if (fileExtension === '.png' || fileExtension === '.jpg' || fileExtension === '.jpeg' || fileExtension === '.gif' || fileExtension == '') {
        return true;
    }
    else {
        res.status(400).send({ error: 'Extensão do arquivo somente png/jpg/jpeg/gif' });
    }
}
