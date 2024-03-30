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
exports.listALLRecords = exports.listRecordsForDomain = void 0;
const awsConfig_1 = require("../awsConfig");
const listRecordsForDomain = (hostedZoneId, domainName) => __awaiter(void 0, void 0, void 0, function* () {
    const params = {
        HostedZoneId: hostedZoneId,
    };
    try {
        const data = yield awsConfig_1.route53.listResourceRecordSets(params).promise();
        const records = data.ResourceRecordSets.filter(record => record.Name.endsWith(domainName));
        return records;
    }
    catch (error) {
        console.error("Error listing records for domain:", error);
        throw error;
    }
});
exports.listRecordsForDomain = listRecordsForDomain;
const listALLRecords = (hostedZoneId) => __awaiter(void 0, void 0, void 0, function* () {
    const params = {
        HostedZoneId: hostedZoneId,
    };
    try {
        const data = yield awsConfig_1.route53.listResourceRecordSets(params).promise();
        const records = data.ResourceRecordSets;
        return records;
    }
    catch (error) {
        console.error("Error listing all records :", error);
        throw error;
    }
});
exports.listALLRecords = listALLRecords;
// Example usage
// const hostedZoneId = 'YOUR_HOSTED_ZONE_ID'; // Replace with your hosted zone ID
// const domainName = 'example.com.'; // Replace with your domain name
// listRecordsForDomain(hostedZoneId, domainName)
//    .then(records => console.log("Records for Domain:", records))
//    .catch(error => console.error("Error:", error));
