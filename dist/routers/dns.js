"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const domain_1 = __importDefault(require("./domain"));
const express_1 = __importDefault(require("express"));
const middlewares_1 = require("../middlewares");
const auth_1 = __importDefault(require("./auth"));
const recordOperatoins_1 = __importDefault(require("./records/recordOperatoins"));
const router = express_1.default.Router();
router.use("/domain", middlewares_1.authenticateLoggedIn, domain_1.default);
router.use("/auth", auth_1.default);
router.use("/record", middlewares_1.authenticateLoggedIn, recordOperatoins_1.default);
exports.default = router;
