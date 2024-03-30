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
exports.checkChangeStatus = void 0;
const awsConfig_1 = require("../awsConfig");
const checkChangeStatus = (changeId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const params = {
        Id: changeId,
    };
    try {
        const data = yield awsConfig_1.route53.getChange(params).promise();
        console.log("Change Status:", (_a = data.ChangeInfo) === null || _a === void 0 ? void 0 : _a.Status);
        return (_b = data.ChangeInfo) === null || _b === void 0 ? void 0 : _b.Status;
    }
    catch (error) {
        console.error("Error checking change status:", error);
    }
});
exports.checkChangeStatus = checkChangeStatus;
