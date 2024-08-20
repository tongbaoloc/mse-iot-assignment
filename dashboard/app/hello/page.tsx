"use client";
import { Button } from "@/components/ui/button";
import { SigV4Utils } from "@/utils/sigV4Utils";
import Paho from "paho-mqtt";

const regionName = process.env.NEXT_PUBLIC_AWS_REGION || "";
const awsIotEndpoint = process.env.NEXT_PUBLIC_AWS_IOT_ENDPOINT || "";
const accessKey = process.env.AWS_ACCESS_KEY || "";
const secretKey = process.env.AWS_SECRET_KEY || "";

const clientId = `clientId-${Math.random().toString(36).substring(2, 15)}`; // Unique client ID

async function connectAndSubscribe() {
  try {
    const url = await SigV4Utils.createWebSocketURL(
      "ap-southeast-1", // YOUR REGION
      "a1kfygo2s7d0ba-ats.iot.ap-southeast-1.amazonaws.com", // YOUR IoT ENDPOINT
      "AKIATZQUBAUZI23ABI74", // YOUR ACCESS KEY
      "xhIaUvTaRHw41zfRg2g1DY0fkg5J0CoJz6m3NZHU" // YOUR SECRET ACCESS KEY
    );
    console.log("WebSocket URL:", url);

    const mqttClient = new Paho.Client(url, clientId);

    // Connection options
    const connectOptions = {
      useSSL: true,
      timeout: 3,
      mqttVersion: 3 as 3 | 4,
      onSuccess: () => {
        console.log("Connected successfully!");
        // Subscribe to a topic after successful connection
        mqttClient.subscribe("things/dht11_01");
      },
      onFailure: (error: Paho.ErrorWithInvocationContext) => {
        console.error("Connection failed:", error);
      },
    };

    // Event handlers
    mqttClient.onMessageArrived = (message: Paho.Message) => {
      console.log("Message arrived:", message.payloadString);
    };

    mqttClient.onConnectionLost = (responseObject: {
      errorMessage: string;
    }) => {
      // Adjust type to match structure
      console.error("Connection lost:", responseObject.errorMessage);
    };

    // Connect to the MQTT broker
    mqttClient.connect(connectOptions);
  } catch (error) {
    console.error("Failed to connect to WebSocket:", error);
  }
}

const Hello = () => {
  return (
    <div className="flex items-center justify-center min-h-screen min-w-screen">
      <Button onClick={() => connectAndSubscribe()}>
        Connect And Subscribe
      </Button>
    </div>
  );
};

export default Hello;
