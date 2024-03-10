"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyUser = void 0;
const prisma_1 = require("../../lib/prisma");
const jwtValidation_1 = require("../../lib/jwtValidation");
async function getMyUser(app) {
    app.get('/get/user', async (request, reply) => {
        //validação jwt e retorno dele em objeto
        const jwt = await (0, jwtValidation_1.jwtValidation)(app, request, reply);
        //pegar o jwt object
        //verificar se o user existe
        const userExists = await prisma_1.prisma.user.findUnique({
            where: {
                id: jwt.sub
            }
        });
        if (!userExists)
            return reply.status(400).send({ error: 'user not found', jwt: true });
        const { email, username } = userExists;
        const userInformation = {
            email,
            username
        };
        return userInformation;
    });
}
exports.getMyUser = getMyUser;
