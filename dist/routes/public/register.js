"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const prisma_1 = require("../../lib/prisma");
const zod_1 = require("zod");
const bcrypt_1 = __importDefault(require("bcrypt"));
async function register(app) {
    app.post('/auth/register', async (req, res) => {
        const userBodySchema = zod_1.z.object({
            username: zod_1.z.string(),
            email: zod_1.z.string(),
            password: zod_1.z.string(),
            confirmPassword: zod_1.z.string()
        });
        //safeparse teria que ser chamado pra validar ai eu teria que chamalo denovo
        const body = await userBodySchema.safeParse(req.body);
        if (!body.success) {
            return res.status(400).send({ error: 'Credenciais estão faltando' });
        }
        const { username, email, password, confirmPassword } = body.data;
        if (password !== confirmPassword)
            return res.status(400).send({ error: 'As senhas precisam ser iguais' });
        const userExists = await prisma_1.prisma.user.findUnique({
            where: {
                email
            }
        });
        if (userExists)
            return res.status(400).send({ error: 'Usuário ja existe' });
        const salt = await bcrypt_1.default.genSalt(12);
        const HashPassword = await bcrypt_1.default.hash(password, salt);
        //TUDO FUNCIONANDO, USUARIO CRIADO E PODE SER AUTENTICADO
        const userCreated = await prisma_1.prisma.user.create({
            data: {
                username,
                email,
                password: HashPassword,
                userFriendly: true
            }
        });
        res.status(201).send({ msg: 'usuario criado' });
    });
}
exports.register = register;
