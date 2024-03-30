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
const db_1 = require("../../db");
const listRecords_1 = require("../../services/aws/records/listRecords");
const RecordsOperationsForHostedZone_1 = require("../../services/aws/records/RecordsOperationsForHostedZone");
const getStatus_1 = require("../../services/aws/lib/getStatus");
const bulkRecordOperation_1 = __importDefault(require("./bulkRecordOperation"));
const router = express_1.default.Router();
router.use("/bulk", bulkRecordOperation_1.default);
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const domainName = req.query.domain;
    const { email, password, _id } = req.cookies.user;
    try {
        const domain = yield db_1.Domains.findOne({ domainName, userId: _id });
        if (domain) {
            const hzId = domain.hostedZoneId;
            const records = yield (0, listRecords_1.listRecordsForDomain)(hzId, domainName);
            if (records) {
                res.status(200).json({ message: "records retrived successfully", records });
            }
        }
        else {
            res.status(400).json({ error: "domain not found" });
        }
    }
    catch (err) {
        res.status(500).json({ message: "Internal server error", error: err });
    }
}));
router.post("/create", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const record = req.body;
    record.param.Action = "CREATE";
    try {
        const response = yield (0, RecordsOperationsForHostedZone_1.addEditDeleteRecordToHostedZone)(record.param, record.hostedZoneId);
        if (response) {
            console.log(response, 'response from create record');
            if (response.ChangeInfo.Status === "PENDING") {
                let status = yield (0, getStatus_1.checkChangeStatus)(response.ChangeInfo.Id);
                if (status) {
                    while (status === "PENDING") {
                        setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
                            status = yield (0, getStatus_1.checkChangeStatus)(response.ChangeInfo.Id);
                        }), 2000);
                    }
                    return res.status(200).json({ message: "record created successfully", status });
                }
            }
            else {
                return res.status(200).json({ message: "record created successfully", status });
            }
        }
    }
    catch (err) {
        return res.status(500).json({ error: "Internal server error" });
    }
}));
router.delete("/delete", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const record = req.body;
    record.param.Action = "DELETE";
    const { _id } = req.cookies['user'];
    const hostedZoneId = record.hostedZoneId;
    try {
        const domain = yield db_1.Domains.findOne({ userId: _id, hostedZoneId });
        // to check whether a user has not taken other users hostedZoneId and trying to delete it
        if (domain) {
            const response = yield (0, RecordsOperationsForHostedZone_1.addEditDeleteRecordToHostedZone)(record.param, record.hostedZoneId);
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
router.put("/update", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const record = req.body;
    record.param.Action = "UPSERT";
    try {
        const response = yield (0, RecordsOperationsForHostedZone_1.addEditDeleteRecordToHostedZone)(record.param, record.hostedZoneId);
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
