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
exports.addEditDeleteRecordToHostedZone = void 0;
const awsConfig_1 = require("../awsConfig");
const addEditDeleteRecordToHostedZone = (param) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(param.param.HostedZoneId,"hzid")
    console.log(param,"params")
    // const params = {
    //     ChangeBatch: {
    //         Changes: [
    //             {
    //                 Action: param.Action,
    //                 ResourceRecordSet: {
    //                     Name: param.ResourceRecordSet.Name,
    //                     Type: param.ResourceRecordSet.Type,
    //                     TTL: param.ResourceRecordSet.TTL,
    //                     AliasTarget: param.ResourceRecordSet.AliasTarget,
    //                     ResourceRecords: param.ResourceRecordSet.ResourceRecords,
    //                     // Routing policy is not directly set in the record set. Instead, you can use the 'Weight' or 'SetIdentifier' fields for routing policies.
    //                     CidrRoutingConfig: param.ResourceRecordSet.CidrRoutingConfig,
    //                     Failover: param.ResourceRecordSet.Failover,
    //                     GeoLocation: param.ResourceRecordSet.GeoLocation,
    //                     GeoProximityLocation: param.ResourceRecordSet.GeoProximityLocation,
    //                     HealthCheckId: param.ResourceRecordSet.HealthCheckId,
    //                     MultiValueAnswer: param.ResourceRecordSet.MultiValueAnswer,
    //                     Region: param.ResourceRecordSet.Region,
    //                     SetIdentifier: param.ResourceRecordSet.SetIdentifier,
    //                     TrafficPolicyInstanceId: param.ResourceRecordSet.TrafficPolicyInstanceId,
    //                     Weight: param.ResourceRecordSet.Weight
    //                 },
    //             },
    //         ],
    //         Comment:param.Comment
    //     },
    //     HostedZoneId:"/hostedzone/Z0282893QXDEPYST0539"
    // };
    const params2 = {
        HostedZoneId: param.param.HostedZoneId,
        ChangeBatch: {
            Changes: param.param.ChangeBatch.Changes,
            Comment: param.param.ChangeBatch.Comment
        }
    };
    try {
        const data = yield awsConfig_1.route53.changeResourceRecordSets(params2).promise();
        console.log("Record Added:", data);
        return data;
    }
    catch (error) {
        console.error("Error adding record:", error);
        throw error;
    }
});
exports.addEditDeleteRecordToHostedZone = addEditDeleteRecordToHostedZone;
// Example usage
// const hostedZoneId = 'YOUR_HOSTED_ZONE_ID'; // Replace with your hosted zone ID
// const recordName = 'subdomain.example.com.'; // Replace with your record name
// const recordType = 'A'; // Replace with your record type (e.g., 'A', 'CNAME', 'MX', etc.)
// const recordValue = '192.0.2.44'; // Replace with your record value
// const alias = {
//     hostedZoneId: 'ALIAS_HOSTED_ZONE_ID', // Replace with the hosted zone ID of the alias target
//     evaluateTargetHealth: false, // Set to true if you want Route 53 to check the health of the alias target
// };
// const routingPolicy = 'WEIGHTED'; // This is an example. Routing policies are not directly set in the record set.
// const ttl = 300; // Time to Live in seconds
// addRecordToHostedZone(hostedZoneId, recordName, recordType, recordValue, alias, routingPolicy, ttl)
//     .then(data => console.log("Record Added Successfully:", data))
//     .catch(error => console.error("Error:", error));
