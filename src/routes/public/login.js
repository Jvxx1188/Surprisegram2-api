"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const prisma_1 = require("../../lib/prisma");
const zod_1 = require("zod");
const bcrypt_1 = __importDefault(require("bcrypt"));
async function login(app) {
    app.post('/auth/login', async (req, res) => {
        const loginBodySchema = zod_1.z.object({
            email: zod_1.z.string(),
            password: zod_1.z.string()
        });
        //safeparse teria que ser chamado pra validar ai eu teria que chamalo denovo
        const body = await loginBodySchema.safeParse(req.body);
        if (!body.success) {
            return res.status(400).send({ error: 'Credenciais estão faltando' });
        }
        const { email, password } = body.data;
        const userExists = await prisma_1.prisma.user.findUnique({
            where: {
                email
            }
        });
        if (!userExists)
            return res.status(400).send({ error: 'Usuario não existe' });
        //CHECA SENHA CORRETA
        const checkPass = await bcrypt_1.default.compare(password, userExists.password);
        if (!checkPass)
            return res.status(400).send({ error: 'Senha incorreta' });
        //CRIA UM TOKEN
        const token = await app.jwt.sign({
            sub: userExists.id,
            expiresIn: '30d'
        });
        res.status(201).send({ msg: 'sucesso, redirecionando...', token });
    });
}
exports.login = login;
