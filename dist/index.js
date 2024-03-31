"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};

Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const app = (0, express_1.default)();
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dns_1 = __importDefault(require("./routers/dns"));
dotenv_1.default.config();
app.use((0, cors_1.default)({
    origin: "*",
    credentials: true
}));
app.use((0, cookie_parser_1.default)());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.post("/", (req, res) => {
    // console.log(JSON.parse(req.body));
    res.json({ message: "hello" , body:"asdfa"});
});
app.use("/api", dns_1.default);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("server listening on port ", PORT);
});
try {
    mongoose_1.default.connect(process.env.DATABASE_LINK, { dbName: 'Domain-Record-db' })
        .then((res) => {
        console.log("db connected");
    })
        .catch(err => {
        console.log(err, "error");
    });
}
catch (err) {
    console.log(err);
}
