import { createHostedZone } from '../../services/aws/hostedZones/createHostedZone'
import express, { Request, Response } from 'express'
import { authenticateLoggedIn } from '../../middlewares'
import { Domains } from '../../db'
import { Route53 } from 'aws-sdk'
import { listRecordsForDomain } from '../../services/aws/records/listRecords'
import { paramsInterface } from '../../services/aws/lib/recordParamsInterface'
import { addEditDeleteRecordToHostedZone } from '../../services/aws/records/RecordsOperationsForHostedZone'
import { checkChangeStatus } from '../../services/aws/lib/getStatus'
import bulkRecordRoutes from './bulkRecordOperation'
const router = express.Router()

type recordType = { param: paramsInterface, hostedZoneId: string }

router.use("/bulk",bulkRecordRoutes)

router.get("/", async (req: Request, res: Response) => {
    const domainName = req.query.domain as string;
    const { email, password, _id } = req.cookies.user;

    try {
        const domain = await Domains.findOne({ domainName, userId: _id })
        if (domain) {
            const hzId = domain.hostedZoneId as string
            const records = await listRecordsForDomain(hzId, domainName);
            if (records) {
                res.status(200).json({ message: "records retrived successfully", records })
            }
        }
        else {
            res.status(400).json({ error: "domain not found" })
        }
    }
    catch (err) {
        res.status(500).json({ message: "Internal server error", error: err })
    }
})

router.post("/create", async (req: Request, res: Response) => {

    const record: recordType = req.body;
    record.param.Action = "CREATE"
    try {
        const response = await addEditDeleteRecordToHostedZone(record.param, record.hostedZoneId)
        if (response) {
            console.log(response, 'response from create record')

            if (response.ChangeInfo.Status === "PENDING") {
                let status = await checkChangeStatus(response.ChangeInfo.Id);
                if (status) {
                    while (status === "PENDING") {
                        setTimeout(async () => {
                            status = await checkChangeStatus(response.ChangeInfo.Id);
                        }, 2000)
                    }
                    return res.status(200).json({ message: "record created successfully", status })
                }

            }
            else {
                return res.status(200).json({ message: "record created successfully", status })
            }
        }
    }
    catch (err) {
        return res.status(500).json({ error: "Internal server error" })
    }

})

router.delete("/delete", async (req: Request, res: Response) => {

    const record: recordType = req.body;
    record.param.Action = "DELETE"
    const { _id } = req.cookies['user']
    const hostedZoneId = record.hostedZoneId;
    try {
        const domain = await Domains.findOne({ userId: _id, hostedZoneId })
        // to check whether a user has not taken other users hostedZoneId and trying to delete it
        if (domain) {
            const response = await addEditDeleteRecordToHostedZone(record.param, record.hostedZoneId)
            if (response) {
                console.log(response, 'response from delete record')

                if (response.ChangeInfo.Status === "PENDING") {
                    let status = await checkChangeStatus(response.ChangeInfo.Id);
                    if (status) {
                        while (status === "PENDING") {
                            setTimeout(async () => {
                                status = await checkChangeStatus(response.ChangeInfo.Id);
                            }, 2000)
                        }
                        return res.status(200).json({ message: "record deleted successfully", status })
                    }

                }
                else {
                    return res.status(200).json({ message: "record deleted successfully", status })
                }
            }
        }
    }
    catch (err) {
        return res.status(500).json({ error: "Internal server error" })
    }

})

router.put("/update", async (req: Request, res: Response) => {

    const record: recordType = req.body;
    record.param.Action = "UPSERT"
    try {
        const response = await addEditDeleteRecordToHostedZone(record.param, record.hostedZoneId)
        if (response) {
            console.log(response, 'response from update record')

            if (response.ChangeInfo.Status === "PENDING") {
                let status = await checkChangeStatus(response.ChangeInfo.Id);
                if (status) {
                    while (status === "PENDING") {
                        setTimeout(async () => {
                            status = await checkChangeStatus(response.ChangeInfo.Id);
                        }, 2000)
                    }
                    return res.status(200).json({ message: "record updated successfully", status })
                }

            }
            else {
                return res.status(200).json({ message: "record updated successfully", status })
            }
        }
    }
    catch (err) {
        return res.status(500).json({ error: "Internal server error" })
    }

})

export default router;



