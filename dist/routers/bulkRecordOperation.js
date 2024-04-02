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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("../db");
const getStatus_1 = require("../services/aws/lib/getStatus");
const BulkRecordsOperationForHostedZone_1 = require("../services/aws/records/BulkRecordsOperationForHostedZone");
const createRecordForDb_1 = require("../services/aws/lib/createRecordForDb");
const router = express_1.default.Router();
router.post("/create", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { record, routingPolicy } = req.body;
    const { _id } = req.user;
    console.log(record, routingPolicy, "RR");
    try {
        const domain = yield db_1.Domains.findOne({ userId: _id });
        if (domain) {
            const response = yield (0, BulkRecordsOperationForHostedZone_1.bulkAddEditDeleteRecordToHostedZone)(record);
            if (response) {
                console.log(response, 'response from create record');
                const records = yield db_1.Records.insertMany((0, createRecordForDb_1.createRecordForDb)(record, domain._id, routingPolicy));
                if (response.ChangeInfo.Status === "PENDING") {
                    let status = yield (0, getStatus_1.checkChangeStatus)(response.ChangeInfo.Id);
                    if (status) {
                        while (status === "PENDING") {
                            status = yield (0, getStatus_1.checkChangeStatus)(response.ChangeInfo.Id);
                        }
                        return res.status(200).json({ message: "record created successfully", status });
                    }
                }
                else {
                    return res.status(200).json({ message: "record created successfully", status });
                }
            }
        }
        else {
            return res.status(404).json({ error: "domain not found" });
        }
    }
    catch (err) {
        return res.status(500).json({ error: "Internal server error" });
    }
}));
router.post("/delete", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const record = req.body;
    const { _id } = req.user;
    const hostedZoneId = record.param.HostedZoneId;
    try {
        const domain = yield db_1.Domains.findOne({ userId: _id, hostedZoneId });
        // to check whether a user has not taken other users hostedZoneId and trying to delete it
        if (domain) {
            const response = yield (0, BulkRecordsOperationForHostedZone_1.bulkAddEditDeleteRecordToHostedZone)(record);
            if (response) {
                console.log(response, 'response from delete record');
                if (response.ChangeInfo.Status === "PENDING") {
                    let status = yield (0, getStatus_1.checkChangeStatus)(response.ChangeInfo.Id);
                    if (status) {
                        while (status === "PENDING") {
                            setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
                                status = yield (0, getStatus_1.checkChangeStatus)(response.ChangeInfo.Id);
                            }), 2000);
                        }
                        // deleting records from db
                        const recordsToDelete = record.param.ChangeBatch.Changes.map(change => change.ResourceRecordSet.Name);
                        const result = yield db_1.Records.deleteMany({ recordName: { $in: recordsToDelete } });
                        return res.status(200).json({ message: "record deleted successfully", status });
                    }
                }
                else {
                    return res.status(200).json({ message: "record deleted successfully", status });
                }
            }
        }
    }
    catch (err) {
        return res.status(500).json({ error: "Internal server error" });
    }
}));
router.post("/update", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const record = req.body;
    try {
        const response = yield (0, BulkRecordsOperationForHostedZone_1.bulkAddEditDeleteRecordToHostedZone)(record);
        if (response) {
            console.log(response, 'response from update record');
            if (response.ChangeInfo.Status === "PENDING") {
                let status = yield (0, getStatus_1.checkChangeStatus)(response.ChangeInfo.Id);
                if (status) {
                    while (status === "PENDING") {
                        setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
                            status = yield (0, getStatus_1.checkChangeStatus)(response.ChangeInfo.Id);
                        }), 2000);
                    }
                    return res.status(200).json({ message: "record updated successfully", status });
                }
            }
            else {
                return res.status(200).json({ message: "record updated successfully", status });
            }
        }
    }
    catch (err) {
        return res.status(500).json({ error: "Internal server error" });
    }
}));
exports.default = router;
