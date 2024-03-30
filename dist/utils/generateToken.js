"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const jose_1 = require("jose");
const generateToken = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const token = new jose_1.SignJWT(Object.assign({}, user))
        .setProtectedHeader({ alg: 'HS256', typ: "JWT" })
        .setExpirationTime((Math.floor(Date.now() / 1000)) + 60 * 60 * 10) // 10hr
        .setIssuedAt((Math.floor(Date.now() / 1000)))
        .setNotBefore((Math.floor(Date.now() / 1000)))
        .sign(new TextEncoder().encode(process.env.SECRET));
    return token;
});
exports.generateToken = generateToken;
