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
exports.createHostedZone = void 0;
const awsConfig_1 = require("../awsConfig");
const createHostedZone = (domainName) => __awaiter(void 0, void 0, void 0, function* () {
    const params = {
        Name: domainName,
        CallerReference: `${Date.now()}`, // A unique string that identifies the request
    };
    try {
        const data = yield awsConfig_1.route53.createHostedZone(params).promise();
        console.log("Hosted Zone Created:", data.HostedZone.Id);
        return data.HostedZone.Id;
    }
    catch (error) {
        console.error("Error creating hosted zone:", error);
        throw error;
    }
});
exports.createHostedZone = createHostedZone;
// // Example usage
// createHostedZone('example.com')
//     .then(hostedZoneId => console.log("Hosted Zone ID:", hostedZoneId))
//     .catch(error => console.error("Error:", error));
