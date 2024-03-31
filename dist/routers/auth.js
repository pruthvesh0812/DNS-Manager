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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const inputVal_1 = require("../utils/inputVal");
const db_1 = require("../db");
const generateToken_1 = require("../utils/generateToken");
const middlewares_1 = require("../middlewares");
const router = express_1.default.Router();
// signup route
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("reaching signup");
    const parsedInputSchema = inputVal_1.authInputSchema.safeParse(req.body);
    if (!parsedInputSchema.success) {
        return res.status(400).json({ message: "Bad request, Wrong input", error: parsedInputSchema.error });
    }
    else {
        const { email, password } = parsedInputSchema.data;
        const user = yield db_1.Users.findOne({ email, password });
        if (user) {
            return res.status(409).json({ message: "user already exists" });
        }
        else {
            const newUser = new db_1.Users({ email, password });
            yield newUser.save();
            const token = yield (0, generateToken_1.generateToken)({ email, password });
            // attach user to cookie
            res.cookie('user', JSON.stringify(user), { maxAge: 36000000, httpOnly: true, path: '/' });
            res.cookie('userToken', `${token}`, { maxAge: 36000000, httpOnly: true });
            // res.setHeader('Set-Cookie', `userToken=${token}; HttpOnly; Path=/ ; Max-age=36000000`)
            return res.status(200).json({ message: "user created successfully", token: token });
        }
    }
}));
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("login1");
    const parsedInputSchema = inputVal_1.authInputSchema.safeParse(req.body);
    if (!parsedInputSchema.success) {
        return res.status(400).json({ message: "Bad request, Wrong input", error: parsedInputSchema.error });
    }
    else {
        console.log("login2");
        const { email, password } = parsedInputSchema.data;
        const user = yield db_1.Users.findOne({ email, password });
        if (user) {
            console.log("login3");
            const token = yield (0, generateToken_1.generateToken)({ email, password });
            res.cookie('userToken', `${token}`, { maxAge: 36000000, httpOnly: true }); //httpOnly client side js cant access cookie
            // res.setHeader('Set-Cookie', `userToken=${token}; HttpOnly; Path=/ ; Max-age=36000000`) 
            console.log("login4");
            // attach user to cookie
            res.cookie('user', JSON.stringify(user), { maxAge: 36000000, httpOnly: true, path: '/' });
            console.log("login5");
            const userRole = yield db_1.UserRoles.findById({ _id: user._id });
            let role = '';
            if (userRole) {
                console.log("login6");
                res.cookie('userRole', `${userRole.role}`, { maxAge: 36000000, httpOnly: true });
                role = userRole.role;
            }
            else {
                res.cookie('userRole', '', { maxAge: 36000000, httpOnly: true });
            }
            console.log("login7");
            return res.status(200).json({ message: "logged in successfully", token: token, userRole: role });
        }
        else {
            return res.status(404).json({ message: "user not found" });
        }
    }
}));
router.post("/setUserRole", middlewares_1.authenticateLoggedIn, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, _id } = JSON.parse(req.cookies.user);
    console.log(req.cookies, _id);
    const { userRole } = req.body;
    try {
        const newRole = new db_1.UserRoles({ userId: _id, role: userRole });
        yield newRole.save();
        res.cookie('userRole', `${userRole}`, { maxAge: 36000000, httpOnly: true });
        res.status(200).json({ message: "user role set successfully" });
    }
    catch (err) {
        console.log(err, "error in creating role");
        res.status(500).json({ error: "Internal server error while creating user role" });
    }
}));
exports.default = router;
