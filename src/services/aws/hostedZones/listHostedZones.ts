import { route53 } from '../awsConfig'

export const listHostedZones = async () => {
    try {
        const res = await route53.listHostedZones().promise()
        if (res) {
            return res.HostedZones
        }
    }
    catch (err) {
        console.error("Error listing hosted zones:", err);
        throw err;
    }
}