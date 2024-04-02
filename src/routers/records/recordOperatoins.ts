import { createHostedZone } from '../../services/aws/hostedZones/createHostedZone'
import express, { Request, Response } from 'express'
import { authenticateLoggedIn } from '../../middlewares'
import { Domains, Records } from '../../db'
import { Route53 } from 'aws-sdk'
import { listRecordsForDomain } from '../../services/aws/records/listRecords'
import { paramsInterface } from '../../services/aws/lib/recordParamsInterface'
import { addEditDeleteRecordToHostedZone } from '../../services/aws/records/RecordsOperationsForHostedZone'
import { checkChangeStatus } from '../../services/aws/lib/getStatus'
import bulkRecordRoutes from './bulkRecordOperation'
import { createRecordForDb } from '../../services/aws/lib/createRecordForDb'
import { userType } from '../../req'
const router = express.Router()

// declare type for record parameters
type recordType = { param: Route53.ChangeResourceRecordSetsRequest }

// incorporate the type routing policy 
type recordAndRoutingPolicy = { record: recordType; routingPolicy: string }

router.use("/bulk", bulkRecordRoutes)

router.get("/", async (req: Request, res: Response) => {
    const domainName = req.query.domain as string;
    const { email, password, _id } = req.user as userType 
    // JSON.parse(req.cookies.user) user object is in json but in string format so need to parse that
    console.log(domainName, _id)

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

    const { record, routingPolicy }: recordAndRoutingPolicy = req.body;
    console.log(record, 'record param and hostedZid')
    const {_id} = req.user as userType 
    try {
        // to get domainId
        const domain = await Domains.findOne({userId:_id})
        //check domain exists
        if(domain){

            // add record to hostedZone on aws
            const response = await addEditDeleteRecordToHostedZone(record)

            //check if response
            if (response) {
                    console.log(response, 'response from create record')

                    // save record to db
                    
                    const recordSaved = new Records(createRecordForDb(record, domain._id ,routingPolicy))
                    await recordSaved.save()
                    
                    // check status to return res on INSYNC
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
        }else{
            return res.status(404).json({ error: "domain does not exists" })
        }
        
    }
    catch (err) {
        return res.status(500).json({ error: "Internal server error" })
    }

})

router.delete("/delete", async (req: Request, res: Response) => {

    const record: recordType = req.body;

    const { _id } = req.user as userType 
    const hostedZoneId = record.param.HostedZoneId;
    try {
        const domain = await Domains.findOne({ userId: _id, hostedZoneId })
        // to check whether a user has not taken other users hostedZoneId and trying to delete it
        if (domain) {
            const response = await addEditDeleteRecordToHostedZone(record)
            if (response) {
                console.log(response, 'response from delete record')

                if (response.ChangeInfo.Status === "PENDING") {
                    let status = await checkChangeStatus(response.ChangeInfo.Id);
                    if (status) {
                        while (status === "PENDING") {
                            status = await checkChangeStatus(response.ChangeInfo.Id);
                        }
                        const result = await Records.deleteOne({recordName:record.param.ChangeBatch.Changes[0].ResourceRecordSet.Name})
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

    try {
        const response = await addEditDeleteRecordToHostedZone(record)
        if (response) {
            console.log(response, 'response from update record')

            if (response.ChangeInfo.Status === "PENDING") {
                let status = await checkChangeStatus(response.ChangeInfo.Id);
                if (status) {
                    while (status === "PENDING") {
                        status = await checkChangeStatus(response.ChangeInfo.Id);
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



