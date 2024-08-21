import AWSIoT from "aws-iot-device-sdk";

export function createIoTDevice() {
  // Replace these with your actual AWS IoT credentials and endpoint
  const region = "ap-southeast-1";
  const host = "a1kfygo2s7d0ba-ats.iot.ap-southeast-1.amazonaws.com"; // Your IoT endpoint
  const accessKeyId = "AKIATZQUBAUZI23ABI74";
  const secretAccessKey = "xhIaUvTaRHw41zfRg2g1DY0fkg5J0CoJz6m3NZHU";

  return new AWSIoT.device({
    region,
    host,
    protocol: "wss",
    accessKeyId,
    secretKey: secretAccessKey,

    clientId: `clientId-${Math.random().toString(36).substring(2, 15)}`,
  });
}
