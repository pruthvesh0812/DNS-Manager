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
exports.deleteHostedZone = void 0;
const awsConfig_1 = require("../awsConfig");
const RecordsOperationsForHostedZone_1 = require("../records/RecordsOperationsForHostedZone");
const db_1 = require("../../../db");
const listRecords_1 = require("../records/listRecords");
const deleteHostedZone = (hostedZoneId, domainId) => __awaiter(void 0, void 0, void 0, function* () {
    const params = {
        Id: hostedZoneId,
    };
    // user created records need to be deleted before deleting a hosted zone
    try {
        // get user created record
        const userCreatedRecords = yield db_1.Records.find({ domainId });
        // // infer recordName and recordType as string to avoid type errors
        // const NameTypeForResourceRecordSet = userCreatedRecords.map(ele => ({Name:ele.recordName as string, Type:ele.recordType as string}))
        // get domain
        const domain = yield db_1.Domains.findOne({ hostedZoneId });
        if (domain) {
            // list all records under required domain
            const allResourceRecordSet = yield (0, listRecords_1.listRecordsForDomain)(hostedZoneId, domain.domainName);
            // filter records which are user created from all domains
            const filterdRecords = allResourceRecordSet.filter(eachRRS => (userCreatedRecords.some(ucr => (ucr.recordName === eachRRS.Name))));
            const recordsToDelete = {
                param: {
                    ChangeBatch: {
                        Changes: filterdRecords.map(eachRecord => ({
                            Action: "DELETE",
                            ResourceRecordSet: eachRecord
                        })),
                        Comment: "to delete hosted zone"
                    },
                    HostedZoneId: hostedZoneId
                }
            };
            const responseDelete = yield (0, RecordsOperationsForHostedZone_1.addEditDeleteRecordToHostedZone)(recordsToDelete);
            if (responseDelete) {
                const data = yield awsConfig_1.route53.deleteHostedZone(params).promise();
                console.log("Hosted Zone Deleted:", data);
                return data;
            }
            else {
                throw "internal server error while deleting hostedzone";
            }
        }
        else {
            throw "hosted zone does not exists";
        }
    }
    catch (error) {
        console.error("Error deleting hosted zone:", error);
        throw error;
    }
});
exports.deleteHostedZone = deleteHostedZone;
