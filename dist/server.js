"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const jwt_1 = __importDefault(require("@fastify/jwt"));
const dotenv_1 = __importDefault(require("dotenv"));
const get_my_user_information_1 = require("./routes/get/get-my-user-information");
const register_1 = require("./routes/public/register");
const login_1 = require("./routes/public/login");
const cors_1 = __importDefault(require("@fastify/cors"));
const create_post_1 = require("./routes/post/create-post");
const cloudinary_1 = require("cloudinary");
const get_recent_posts_1 = require("./routes/get/get-recent-posts");
const send_like_to_post_1 = require("./routes/post/send-like-to-post");
dotenv_1.default.config();
//cloudnary config
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});
console.log(process.env.CLOUDINARY_NAME, process.env.CLOUDINARY_SECRET, process.env.CLOUDINARY_KEY);
const jwtSecret = process.env.SECRET;
const app = (0, fastify_1.default)();
app.register(cors_1.default, {
    origin: "*",
});
//registers
app.register(get_my_user_information_1.getMyUser);
app.register(register_1.register);
app.register(login_1.login);
app.register(create_post_1.createPost);
app.register(get_recent_posts_1.getRecentPosts);
app.register(send_like_to_post_1.sendLikeToPost);
if (!jwtSecret) {
    console.error("A variável de ambiente SECRET não está definida.");
    process.exit(1);
}
app.register(jwt_1.default, {
    secret: jwtSecret,
});
app.listen({ port: 5000 }).then(() => {
    console.log("HTTP Server running on http://localhost:3333");
});
