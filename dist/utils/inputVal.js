"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authInputSchema = void 0;
const zod_1 = require("zod");
exports.authInputSchema = zod_1.z.object({
    email: zod_1.z.string().min(5),
    password: zod_1.z.string().min(8).max(20)
});
