// awsIoTUtils.js
import AWSIoT from "aws-iot-device-sdk";

export function createIoTDevice() {

  const region = "ap-southeast-1";
  const host = process.env.NEXT_PUBLIC_AWS_IOT_HOST; // Use environment variable for the host


  return new AWSIoT.device({
    region,
    host,
    protocol: "wss",
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
    secretKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
    clientId: `clientId-${Math.random().toString(36).substring(2, 15)}`,
  });
}
