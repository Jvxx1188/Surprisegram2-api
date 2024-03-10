"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendLikeToPost = void 0;
const prisma_1 = require("../../lib/prisma");
const jwtValidation_1 = require("../../lib/jwtValidation");
const zod_1 = __importDefault(require("zod"));
async function sendLikeToPost(app) {
    app.post("/posts/:id/like", async (req, res) => {
        const jwt = await (0, jwtValidation_1.jwtValidation)(app, req, res);
        const postParamsSchema = zod_1.default.object({
            id: zod_1.default.string(),
        });
        const { id } = postParamsSchema.parse(req.params);
        //vamos ver se o usuário ja tem um voto nesse post
        const alreadyVoted = await prisma_1.prisma.vote.findFirst({
            where: {
                postId: id,
                userId: jwt.sub,
            },
        });
        if (alreadyVoted) {
            return res.status(200).send({ message: "você já deu like neste post" });
        }
        const postIdIsValid = await prisma_1.prisma.post.findUnique({
            where: {
                id: id
            }
        });
        if (!postIdIsValid) {
            return res.status(400).send({ message: 'esse post não existe?' });
        }
        //vamos criar o voto
        await prisma_1.prisma.vote.create({
            data: {
                postId: id,
                userId: jwt.sub,
            },
        });
        return res.status(201).send({ message: 'like efetuado com sucesso', increment: true });
    });
}
exports.sendLikeToPost = sendLikeToPost;
