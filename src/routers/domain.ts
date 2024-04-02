import { createHostedZone } from '../services/aws/hostedZones/createHostedZone'
import express, { Request, Response } from 'express'
import { authenticateLoggedIn } from '../middlewares'
import { Domains } from '../db'
import { deleteHostedZone } from '../services/aws/hostedZones/deleteHostedZone'
import { listHostedZones } from '../services/aws/hostedZones/listHostedZones'
import { ListHostedZonesType } from '../services/aws/lib/typesForHostedZone'
import { Route53 } from 'aws-sdk'
import { checkChangeStatus } from '../services/aws/lib/getStatus'
const router = express.Router()

router.post("/create", async (req: Request, res: Response) => {
    const { domain } = req.body;
    console.log(req.cookies.user)
    const { email, password, _id } = JSON.parse(req.cookies.user);
    const userRole = req.cookies.userRole;

    //check domain exists
    try {
        const res1 = await fetch(`https://${domain}`, { method: 'HEAD' })
        const res2 = await fetch(`http://${domain}`, { method: 'HEAD' })

        if (res1.ok || res2.ok) {
            console.log('domain:', domain, 'exists');

            try {
                // create hosted zone
                const hostedZoneId = await createHostedZone(domain)
                if (hostedZoneId) {

                    const newDomain = new Domains({ domainName: domain, hostedZoneId, userId: _id })
                    await newDomain.save()
                    res.status(200).json({ message: "hosted zone created succesfully", hostedZoneId })
                }
                else {
                    res.status(500).json({ error: "Internal Server Error while creating hosted zone" })
                }
            }
            catch (hostedZoneError) {
                console.log(hostedZoneError, "hosted zone error")
                res.status(500).json({ error: "Internal Server Error while creating hosted zone" })
            }

        }
        else {
            res.status(400).json({ error: "domain doesnt exists" })
            console.log('domain doesnt exists')
        }
    }
    catch (fetchError) {
        console.log("Error while checking domain", fetchError)
    }

})

router.delete("/delete", async (req: Request, res: Response) => {
    const { email, password, _id } = JSON.parse(req.cookies.user)
    const hostedZoneId = req.query.hostedZoneId as string;
    
    try {
        //check if userId maps to hostedZoneId
        const domain = await Domains.findOne({ userId: _id, hostedZoneId })
        if (domain) {
            const response = await deleteHostedZone(hostedZoneId,domain._id);
            if (response) {
                let status:string = response.ChangeInfo.Status;
                while(status === "PENDING"){
                    status = await checkChangeStatus(response.ChangeInfo.Id) as string
                }
                const result = await Domains.deleteOne({hostedZoneId})
                res.status(200).json({ message: "hosted zone deleted", response })
            }
        }
        else {
            res.status(401).json({ error: "unauthorized to delete domain" })
        }
    }
    catch (err) {
        res.status(500).json({ error: "Internal server error" })
    }
})

router.get("/hostedZones", async (req: Request, res: Response) => {
    const { email, password, _id } = JSON.parse(req.cookies.user)
    console.log(_id,"id of domain")
    try {
        
        const domains = await Domains.find({userId:_id})
        console.log(domains,"domains")
        if(domains){
            const response  = await listHostedZones(); // returns promise of HostedZone array
            // check if promise is undefined
            if(response){
                console.log(response,"response")          
                const userHostedZones = response.filter((ele) => domains.some(domain => domain.hostedZoneId === ele.Id))
                res.status(200).json({ message: "hosted zones:", userHostedZones })
            }
        }      
       
    }
    catch (err) {
    res.status(500).json({ error: "Internal server error" })
}
})

export default router;
