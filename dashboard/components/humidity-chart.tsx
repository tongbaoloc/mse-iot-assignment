"use client";

import { useEffect, useState } from "react";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";

import * as Paho from "paho-mqtt";
import { SigV4Utils } from "../utils/sigV4Utils";

const initialData = [
  { type: "humidity", temp: 89, fill: "var(--color-safari)" },
];

const chartConfig = {
  type: {
    label: "Humidity",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export default function Humidity() {
  const [client, setClient] = useState<Paho.Client | null>(null);
  const [chartData, setChartData] = useState(initialData);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const region = process.env.NEXT_PUBLIC_AWS_REGION;
  const endpoint = process.env.NEXT_PUBLIC_AWS_IOT_ENDPOINT;
  const accessKey = process.env.NEXT_PUBLIC_AWS_ACCESS_KEY;
  const secretKey = process.env.NEXT_PUBLIC_AWS_SECRET_KEY;

  useEffect(() => {
    const initializeClient = async () => {
      try {
        if (!region || !endpoint || !accessKey || !secretKey) {
          throw new Error("AWS configuration is missing.");
        }

        // Await the endpoint creation
        const endpointUrl = await SigV4Utils.createWebSocketURL(
          region,
          endpoint,
          accessKey,
          secretKey
        );

        const clientId = Math.random().toString(36).substring(7);
        const mqttClient = new Paho.Client(endpointUrl, clientId);
        const connectOptions = {
          useSSL: true,
          onSuccess: () => subscribe(mqttClient),
          onFailure: (error: any) => console.error("Connection failed:", error),
        };

        mqttClient.connect(connectOptions);
        mqttClient.onMessageArrived = onMessage;
        mqttClient.onConnectionLost = (e: any) =>
          console.log("Connection lost:", e);

        setClient(mqttClient);
      } catch (error) {
        console.error("Error initializing MQTT client:", error);
      }
    };

    initializeClient();

    return () => {
      client?.disconnect();
    };
  }, []);

  function subscribe(client: Paho.Client) {
    client?.subscribe("things/dht11_01");
    console.log("subscribed");
  }

  function onMessage(message: Paho.Message) {
    const status = JSON.parse(message.payloadString);
    console.log(status);
    // Handle message data, e.g., update chartData here
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const randomTemp = Math.floor(Math.random() * 101);

      setChartData([
        { type: "humidity", temp: randomTemp, fill: "var(--color-safari)" },
      ]);

      setLastUpdated(new Date());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Humidity Chart</CardTitle>
        <CardDescription>Real-time humidity levels</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={0}
            endAngle={(chartData[0].temp / 100) * 360}
            innerRadius={80}
            outerRadius={140}
            barSize={15}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[86, 74]}
            />
            <RadialBar
              dataKey="temp"
              background
              cornerRadius={10}
              fill="var(--color-safari)"
            />
            <PolarRadiusAxis
              angle={90}
              type="number"
              domain={[0, 100]}
              tick={false}
              tickLine={false}
              axisLine={false}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-4xl font-bold"
                        >
                          {chartData[0].temp.toLocaleString()}%
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Humidity
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Updated at {lastUpdated.toLocaleTimeString()}
        </div>
      </CardFooter>
    </Card>
  );
}
