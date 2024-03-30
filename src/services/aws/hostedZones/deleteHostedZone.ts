import { Route53 } from 'aws-sdk';
import { route53 } from '../awsConfig'
import { addEditDeleteRecordToHostedZone } from '../records/RecordsOperationsForHostedZone';
import {Types} from 'mongoose'
import { Domains, Records } from '../../../db';
import { listRecordsForDomain } from '../records/listRecords';
import { checkChangeStatus } from '../lib/getStatus';
type recordType = { param: Route53.ChangeResourceRecordSetsRequest }


export const deleteHostedZone = async (hostedZoneId: string, domainId: Types.ObjectId) => {
   const params = {
      Id: hostedZoneId,
   };
   // user created records need to be deleted before deleting a hosted zone
   try {
      // get user created record
      const userCreatedRecords = await Records.find({ domainId })
      
      // // infer recordName and recordType as string to avoid type errors
      // const NameTypeForResourceRecordSet = userCreatedRecords.map(ele => ({Name:ele.recordName as string, Type:ele.recordType as string}))
      
      // get domain
      const domain = await Domains.findOne({ hostedZoneId })
      if (domain) {

         // list all records under required domain
         const allResourceRecordSet = await listRecordsForDomain(hostedZoneId, domain.domainName as string)
         
         // filter records which are user created from all domains
         const filterdRecords: Route53.ResourceRecordSet[] = allResourceRecordSet.filter(eachRRS => (
            userCreatedRecords.some(ucr => (ucr.recordName === eachRRS.Name))
         ))
         const recordsToDelete: recordType = {
            param: {
               ChangeBatch: {
                  Changes:
                  filterdRecords.map(eachRecord => (
                        {
                           Action: "DELETE",
                           ResourceRecordSet: eachRecord
                        }
                     )),
                   Comment: "to delete hosted zone"
               },
               HostedZoneId: hostedZoneId
            }
         }
         const responseDelete = await addEditDeleteRecordToHostedZone(recordsToDelete)
         if (responseDelete) {
               let status = responseDelete.ChangeInfo.Status as string
               while( status === "PENDING"){
                  status = await checkChangeStatus(responseDelete.ChangeInfo.Id) as string
               }
               const data = await route53.deleteHostedZone(params).promise();
               console.log("Hosted Zone Deleted:", data);
               return data;
         }
         else{
            throw "internal server error while deleting hostedzone"
         }
      }
      else{
         throw "hosted zone does not exists"
      }

   } catch (error) {
   console.error("Error deleting hosted zone:", error);
   throw error;
}
};

