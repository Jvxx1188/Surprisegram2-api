"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecentPosts = void 0;
const prisma_1 = require("../../lib/prisma");
const jwtValidation_1 = require("../../lib/jwtValidation");
async function getRecentPosts(app) {
    app.get("/get/posts", async (request, reply) => {
        //validação jwt e retorno dele em objeto
        const jwt = await (0, jwtValidation_1.jwtValidation)(app, request, reply);
        //pegar o jwt object
        //pegar todos os meus objetos por ordem de criação
        const getRecentPosts = await prisma_1.prisma.post.findMany({
            orderBy: {
                createdAt: "desc",
            },
            select: {
                id: true,
                title: true,
                imgUrl: true,
                Vote: {
                    select: {
                        id: true
                    }
                },
                user: {
                    select: {
                        username: true,
                    },
                },
            },
        });
        const retornoDosPostsRecentesOrganizados = await getRecentPosts.reduce((obj, line, i) => {
            const { username } = line.user;
            const { title } = line;
            const { imgUrl } = line;
            const linhaOrganizada = {
                title,
                username,
                imgUrl,
                likesCount: line.Vote.length,
                id: line.id
            };
            obj.push(linhaOrganizada);
            return obj;
        }, []);
        //incluir nome do cara que criou o post nesse pegar ai
        //enviar de volta
        //array de objetos que vem baseado na datetime
        return retornoDosPostsRecentesOrganizados;
    });
}
exports.getRecentPosts = getRecentPosts;
