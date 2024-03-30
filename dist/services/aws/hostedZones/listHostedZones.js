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
exports.listHostedZones = void 0;
const awsConfig_1 = require("../awsConfig");
const listHostedZones = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield awsConfig_1.route53.listHostedZones().promise();
        if (res) {
            return res.HostedZones;
        }
    }
    catch (err) {
        console.error("Error listing hosted zones:", err);
        throw err;
    }
});
exports.listHostedZones = listHostedZones;
