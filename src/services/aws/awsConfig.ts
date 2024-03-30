import AWS from 'aws-sdk'
import dotenv from 'dotenv'

dotenv.config()

const accessKeyId = process.env.ACCESS_KEY_ID;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;

// Configure AWS Region
AWS.config.update({ 
    accessKeyId,
    secretAccessKey,
    region: 'ap-south-1' });

export const route53 = new AWS.Route53({
    maxRetries: 3, // Number of times to retry before failing
    retryDelayOptions: {
    base: 1000, // Initial delay in milliseconds
    customBackoff: () => 2000, // Custom backoff function
 },
});

  