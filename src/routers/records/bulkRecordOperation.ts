import express, { Request, Response } from 'express'
import { authenticateLoggedIn } from '../../middlewares'
import { Domains } from '../../db'
import { Route53 } from 'aws-sdk'
import { listRecordsForDomain } from '../../services/aws/records/listRecords'
import { paramsInterface } from '../../services/aws/lib/recordParamsInterface'
import { checkChangeStatus } from '../../services/aws/lib/getStatus'
import { bulkAddEditDeleteRecordToHostedZone } from '../../services/aws/records/BulkRecordsOperationForHostedZone'

const router = express.Router()

type recordType = { param: Route53.ChangeResourceRecordSetsRequest}

router.post("/create", async (req: Request, res: Response) => {

    const record: recordType = req.body;

    try {
        const response = await bulkAddEditDeleteRecordToHostedZone(record)
        if (response) {
            console.log(response, 'response from create record')

            if (response.ChangeInfo.Status === "PENDING") {
                let status = await checkChangeStatus(response.ChangeInfo.Id);
                if (status) {
                    while (status === "PENDING") {
                            status = await checkChangeStatus(response.ChangeInfo.Id);
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

router.post("/delete", async (req: Request, res: Response) => {

    const record: recordType = req.body;

    const { _id } = JSON.parse(req.cookies.user)
    const hostedZoneId = record.param.HostedZoneId;
    try {
        const domain = await Domains.findOne({ userId: _id, hostedZoneId })
        // to check whether a user has not taken other users hostedZoneId and trying to delete it
        if (domain) {
            const response = await bulkAddEditDeleteRecordToHostedZone(record)
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

router.post("/update", async (req: Request, res: Response) => {

    const record: recordType = req.body;

    try {
        const response = await bulkAddEditDeleteRecordToHostedZone(record)
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



