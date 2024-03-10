"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtValidation = void 0;
const zod_1 = __importDefault(require("zod"));
async function jwtValidation(app, request, reply) {
    const { authorization } = request.headers;
    if (!authorization) {
        return reply.status(401).send({ error: 'Token inexistente', jwt: true });
        //reset application front
    }
    const jwt = authorization.split(" ").length > 0 ? authorization.split(" ")[1] : authorization;
    const userSchema = zod_1.default.object({
        email: zod_1.default.string().email(),
        sub: zod_1.default.string().uuid(),
        iat: zod_1.default.number(),
        exp: zod_1.default.number()
    });
    //verificação do jwt com tipagem
    try {
        const user = await app.jwt.verify(jwt);
        return user;
    }
    catch {
        return reply.status(401).send({ error: 'Token invalido', jwt: true });
    }
    //verifique se o jwt é valido
}
exports.jwtValidation = jwtValidation;
