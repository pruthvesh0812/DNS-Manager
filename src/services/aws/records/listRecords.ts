import { route53 } from "../awsConfig";

export const listRecordsForDomain = async (hostedZoneId: string, domainName: string) => {
   const params = {
      HostedZoneId: hostedZoneId,
   };

   try {
      const data = await route53.listResourceRecordSets(params).promise();
      console.log(data,"all records")
      const domain = domainName + '.';
      const records = data.ResourceRecordSets.filter(record => (record.Name == domain));
      return records;
   } catch (error) {
      console.error("Error listing records for domain:", error);
      throw error;
   }
};

export const listALLRecords= async (hostedZoneId: string) => {
   const params = {
      HostedZoneId: hostedZoneId,
   };

   try {
      const data = await route53.listResourceRecordSets(params).promise();
      const records = data.ResourceRecordSets
      return records;
   } catch (error) {
      console.error("Error listing all records :", error);
      throw error;
   }
};

// Example usage
// const hostedZoneId = 'YOUR_HOSTED_ZONE_ID'; // Replace with your hosted zone ID
// const domainName = 'example.com.'; // Replace with your domain name

// listRecordsForDomain(hostedZoneId, domainName)
//    .then(records => console.log("Records for Domain:", records))
//    .catch(error => console.error("Error:", error));
