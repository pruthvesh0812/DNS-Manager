"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRecordForDb = void 0;
const createRecordForDb = (record, domainId, routingPolicy) => {
    const changes = record.param.ChangeBatch.Changes;
    if (changes.length == 1) {
        return {
            recordAction: changes[0].Action,
            recordType: changes[0].ResourceRecordSet.Type,
            recordName: changes[0].ResourceRecordSet.Name + '.',
            ttl: changes[0].ResourceRecordSet.TTL,
            recordRoutingPolicy: routingPolicy,
            domainId
        };
    }
    else {
        const records = changes.map((change) => ({
            recordAction: change.Action,
            recordType: change.ResourceRecordSet.Type,
            recordName: change.ResourceRecordSet.Name  + '.',
            ttl: change.ResourceRecordSet.TTL,
            recordRoutingPolicy: routingPolicy,
            domainId
        }));
        return records;
    }
};
exports.createRecordForDb = createRecordForDb;
