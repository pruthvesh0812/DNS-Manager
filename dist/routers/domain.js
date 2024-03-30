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
const createHostedZone_1 = require("../services/aws/hostedZones/createHostedZone");
const express_1 = __importDefault(require("express"));
const db_1 = require("../db");
const deleteHostedZone_1 = require("../services/aws/hostedZones/deleteHostedZone");
const listHostedZones_1 = require("../services/aws/hostedZones/listHostedZones");
const router = express_1.default.Router();
router.post("/create", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { domain } = req.body;
    const { email, password, _id } = JSON.parse(req.cookies.user);
    const userRole = req.cookies.userRole;
    //check domain exists
    try {
        const res1 = yield fetch(`https://${domain}`, { method: 'HEAD' });
        const res2 = yield fetch(`http://${domain}`, { method: 'HEAD' });
        if (res1.ok || res2.ok) {
            console.log('domain:', domain, 'exists');
            try {
                // create hosted zone
                const hostedZoneId = yield (0, createHostedZone_1.createHostedZone)(domain);
                if (hostedZoneId) {
                    const newDomain = new db_1.Domains({ domainName: domain, hostedZoneId, userId: _id });
                    yield newDomain.save();
                    res.status(200).json({ message: "hosted zone created succesfully", hostedZoneId });
                }
                else {
                    res.status(500).json({ error: "Internal Server Error while creating hosted zone" });
                }
            }
            catch (hostedZoneError) {
                console.log(hostedZoneError, "hosted zone error");
                res.status(500).json({ error: "Internal Server Error while creating hosted zone" });
            }
        }
        else {
            res.status(400).json({ error: "domain doesnt exists" });
            console.log('domain doesnt exists');
        }
    }
    catch (fetchError) {
        console.log("Error while checking domain", fetchError);
    }
}));
router.delete("/delete:HostedZoneId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, _id } = req.cookies.user;
    const hostedZoneId = req.params.HostedZoneId;
    try {
        //check if userId maps to hostedZoneId
        const domain = yield db_1.Domains.findOne({ userId: _id, hostedZoneId });
        if (domain) {
            const response = yield (0, deleteHostedZone_1.deleteHostedZone)(hostedZoneId);
            if (response) {
                res.status(200).json({ message: "hosted zone deleted", response });
            }
        }
        else {
            res.status(401).json({ error: "unauthorized to delete domain" });
        }
    }
    catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
}));
router.get("/hostedZones", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, _id } = JSON.parse(req.cookies.user);
    console.log(_id, "id of domain");
    try {
        const domains = yield db_1.Domains.find({userId:_id});
        console.log(domains, "domains");
        if (domains) {
            const response = yield (0, listHostedZones_1.listHostedZones)(); // returns promise of HostedZone array
            // check if promise is undefined
            if (response) {
                console.log(response, "response");
                const userHostedZones = response.filter((ele) => domains.some(domain => domain.hostedZoneId === ele.Id))
                res.status(200).json({ message: "hosted zones:", userHostedZones });
            }
        }
    }
    catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
}));
exports.default = router;
