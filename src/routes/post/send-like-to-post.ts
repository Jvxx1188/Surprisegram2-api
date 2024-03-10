import { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma";
import { jwtValidation } from "../../lib/jwtValidation";
import z from "zod";

export async function sendLikeToPost(app: FastifyInstance) {
  app.post("/posts/:id/like", async (req, res) => {
    const jwt = await jwtValidation(app, req, res);
    const postParamsSchema = z.object({
      id: z.string(),
    });
    const { id } = postParamsSchema.parse(req.params);

    //vamos ver se o usuário ja tem um voto nesse post
    const alreadyVoted = await prisma.vote.findFirst({
      where: {
        postId: id,
        userId: jwt.sub,
      },
    });
    if (alreadyVoted) {
      return res.status(200).send({ message: "você já deu like neste post" });
    }
    const postIdIsValid = await prisma.post.findUnique({
      where: {
        id: id
      }
    })
    if (!postIdIsValid) {
      return res.status(400).send({ message: 'esse post não existe?' })
    }
    //vamos criar o voto
    await prisma.vote.create({
      data: {
        postId: id,
        userId: jwt.sub,
      },
    });

    return res.status(201).send({ message: 'like efetuado com sucesso', increment: true })
  });
}
