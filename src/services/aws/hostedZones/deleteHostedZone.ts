import { route53 } from '../awsConfig'

export const deleteHostedZone = async (hostedZoneId:string) => {
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
   
   