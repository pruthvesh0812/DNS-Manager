import { Route53 } from 'aws-sdk';
import { route53 } from '../awsConfig'
import { addEditDeleteRecordToHostedZone } from '../records/RecordsOperationsForHostedZone';

type recordType = { param: Route53.ChangeResourceRecordSetsRequest }


export const deleteHostedZone = async (hostedZoneId:string) => {
   // addEditDeleteRecordToHostedZone()
    const params = {
       Id: hostedZoneId,
    };
   
    try {
       const data = await route53.deleteHostedZone(params).promise();
       console.log("Hosted Zone Deleted:", data);
       return data;
    } catch (error) {
       console.error("Error deleting hosted zone:", error);
       throw error;
    }
   };
   
   