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
exports.authenticateLoggedIn = void 0;
const jose_1 = require("jose");
const db_1 = require("../db");
const authenticateLoggedIn = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // const token = req.cookies['userToken']
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        if (token) {
            //verify user
            const user = yield (0, jose_1.jwtVerify)(token, new TextEncoder().encode(process.env.SECRET));
            console.log('user', user);
            const { email, password } = user.payload;
            // UPDATE: this code has been moved to /auth/login route
            //check if user still exists to maintain consistency - 
            const userFromDB = yield db_1.Users.findOne({ email, password });
            if (userFromDB) {
                console.log(userFromDB, "user from db");
                req.user = { email: userFromDB.email, password: userFromDB.password, _id: userFromDB._id } || undefined;
                // res.cookie('user', `${userFromDB}`, {maxAge: 36000000, httpOnly: true, path: '/'})
            }
            else {
                return res.status(404).json({ message: "user does not exists" });
            }
            next();
        }
        else {
            return res.status(401).json({ message: "unauthorized" });
        }
    }
});
exports.authenticateLoggedIn = authenticateLoggedIn;
