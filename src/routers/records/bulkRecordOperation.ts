import express, { Request, Response } from 'express'
import { authenticateLoggedIn } from '../../middlewares'
import { Domains, Records } from '../../db'
import { Route53 } from 'aws-sdk'
import { listRecordsForDomain } from '../../services/aws/records/listRecords'
import { paramsInterface } from '../../services/aws/lib/recordParamsInterface'
import { checkChangeStatus } from '../../services/aws/lib/getStatus'
import { bulkAddEditDeleteRecordToHostedZone } from '../../services/aws/records/BulkRecordsOperationForHostedZone'
import { createRecordForDb } from '../../services/aws/lib/createRecordForDb'
import { userType } from '../../req'

const router = express.Router()

type recordType = { param: Route53.ChangeResourceRecordSetsRequest }
type recordAndRoutingPolicy = { record: recordType, routingPolicy: string }


router.post("/create", async (req: Request, res: Response) => {

    const { record, routingPolicy }: recordAndRoutingPolicy = req.body;
    const { _id } = req.user as userType
    console.log(record, routingPolicy, "RR")
    try {
        const domain = await Domains.findOne({ userId: _id })
        if (domain) {
            const response = await bulkAddEditDeleteRecordToHostedZone(record)
            if (response) {
                console.log(response, 'response from create record')
                const records = await Records.insertMany(createRecordForDb(record, domain._id, routingPolicy))

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
        else {
            return res.status(404).json({ error: "domain not found" })
        }

    }
    catch (err) {
        return res.status(500).json({ error: "Internal server error" })
    }

})

router.post("/delete", async (req: Request, res: Response) => {

    const record: recordType = req.body;

    const { _id } = req.user as userType 
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

                        // deleting records from db
                        const recordsToDelete = record.param.ChangeBatch.Changes.map(change => change.ResourceRecordSet.Name)
                        const result = await Records.deleteMany({ recordName: { $in: recordsToDelete } })

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



