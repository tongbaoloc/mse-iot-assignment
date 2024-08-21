"use client";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { createIoTDevice } from "@/utils/awsIoTUtils"; // Regular import

const Hello = () => {
  useEffect(() => {
    const device = createIoTDevice();

    device.on("connect", () => {
      device.subscribe("things/dht11_01");
      console.log("Connected to AWS IoT!");
    });

    device.on("message", (topic: string, payload: any) => {
      console.log(`Message received on topic ${topic}:`, payload.toString());
    });

    device.on("error", (error: any) => {
      console.error("Error:", error);
    });

    return () => {
      device.end();
    };
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen min-w-screen">
      <Button>Connect And Subscribe to AWS IoT</Button>
    </div>
  );
};

export default Hello;
