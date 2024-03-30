
import { route53 } from '../awsConfig'

export const checkChangeStatus = async (changeId: string) => {
 const params = {
    Id: changeId, 
 };

 try {
    const data = await route53.getChange(params).promise();
    console.log("Change Status:", data.ChangeInfo?.Status);
    return data.ChangeInfo?.Status
 } catch (error) {
    console.error("Error checking change status:", error);
 }
}
