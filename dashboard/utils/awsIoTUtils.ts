import AWSIoT from "aws-iot-device-sdk";

export function createIoTDevice() {
  // Replace these with your actual AWS IoT credentials and endpoint
  const region = "";
  const host = ""; // Your IoT endpoint
  const accessKeyId = "";
  const secretAccessKey = "";

  return new AWSIoT.device({
    region,
    host,
    protocol: "wss",
    accessKeyId,
    secretKey: secretAccessKey,

    clientId: `clientId-${Math.random().toString(36).substring(2, 15)}`,
  });
}
