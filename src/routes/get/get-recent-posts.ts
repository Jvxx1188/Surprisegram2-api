import { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma";
import { string, z } from "zod";
import { jwtValidation } from "../../lib/jwtValidation";

export async function getRecentPosts(app: FastifyInstance) {
  app.get("/get/posts", async (request, reply) => {
    //validação jwt e retorno dele em objeto
    const jwt = await jwtValidation(app, request, reply);
    //pegar o jwt object

    //pegar todos os meus objetos por ordem de criação
    const getRecentPosts = await prisma.post.findMany({
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
    interface PostProps {
      username: string;
      title?: string | null;
      likesCount: number;
      imgUrl?: string | null;

    }
    const retornoDosPostsRecentesOrganizados = await getRecentPosts.reduce((obj: Array<PostProps>, line, i) => {

      const { username } = line.user
      const { title } = line;
      const { imgUrl } = line;

      const linhaOrganizada = {
        title,
        username,
        imgUrl,
        likesCount: line.Vote.length,
        id: line.id
      }
      obj.push(linhaOrganizada)
      return obj;
    }, [])


    //incluir nome do cara que criou o post nesse pegar ai

    //enviar de volta

    //array de objetos que vem baseado na datetime
    return retornoDosPostsRecentesOrganizados;
  });
}
