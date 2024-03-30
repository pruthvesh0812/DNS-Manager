"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.route53 = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const accessKeyId = process.env.ACCESS_KEY_ID;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;
// Configure AWS Region
aws_sdk_1.default.config.update({
    accessKeyId,
    secretAccessKey,
    region: 'ap-south-1'
});
exports.route53 = new aws_sdk_1.default.Route53({
    maxRetries: 3,
    retryDelayOptions: {
        base: 1000,
        customBackoff: () => 2000, // Custom backoff function
    },
});
