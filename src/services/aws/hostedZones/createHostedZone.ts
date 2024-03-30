import { route53 } from "../awsConfig";

export const createHostedZone = async (domainName: string) => {
    const params = {
        Name: domainName, // Replace with your domain name
        CallerReference: `${Date.now()}`, // A unique string that identifies the request
    };

    try {
        const data = await route53.createHostedZone(params).promise();
        console.log("Hosted Zone Created:", data.HostedZone.Id);
        return data.HostedZone.Id;
    } catch (error) {
        console.error("Error creating hosted zone:", error);
        throw error;
    }
};

// // Example usage
// createHostedZone('example.com')
//     .then(hostedZoneId => console.log("Hosted Zone ID:", hostedZoneId))
//     .catch(error => console.error("Error:", error));
