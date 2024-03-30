"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoles = exports.Records = exports.Domains = exports.Users = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
// user schema
const userSchema = new mongoose_1.default.Schema({
    email: String,
    password: String,
});
//domain schema
const domainSchema = new mongoose_1.default.Schema({
    domainName: String,
    hostedZoneId: String,
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Users' }
});
// record schema
const recordSchema = new mongoose_1.default.Schema({
    recordAction: String,
    recordType: String,
    recordName: String,
    recordRoutingPolicy: String,
    ttl: Number,
    domainId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Domains' }
});
const userRoleSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Users' },
    role: String
});
exports.Users = mongoose_1.default.model("Users", userSchema);
exports.Domains = mongoose_1.default.model("Domains", domainSchema);
exports.Records = mongoose_1.default.model("Records", recordSchema);
exports.UserRoles = mongoose_1.default.model("UserRoles", userRoleSchema);
