"use client";

import * as React from "react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { createIoTDevice } from "@/utils/awsIoTUtils";

// Define the type for chart data
interface ChartData {
  date: string;
  temp: number;
}

const chartConfig = {
  temp: {
    label: "Temperature",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export default function TempChart() {
  const [chartData, setChartData] = React.useState<ChartData[]>([]);
  const [messages, setMessages] = React.useState<ChartData[]>([]);
  const [isHydrated, setIsHydrated] = React.useState(false); // State to manage hydration

  React.useEffect(() => {
    setIsHydrated(true); // This ensures the component only renders once it's hydrated

    const device = createIoTDevice();

    device.on("connect", () => {
      device.subscribe("things/dht11_01");
      console.log("Connected to AWS IoT!");
    });

    device.on("message", (topic: string, payload: any) => {
      const message = JSON.parse(payload.toString());
      const newEntry: ChartData = {
        date: new Date(message.timestamp * 1000).toISOString(),
        temp: message.Temperature,
      };

      setMessages((prevMessages) => [...prevMessages, newEntry]);

      // Update chart data by adding the new entry and keeping only the last 10 entries
      setChartData((prevData) => [...prevData, newEntry].slice(-10));
    });

    device.on("error", (error: any) => {
      console.error("Error:", error);
    });

    return () => {
      device.end();
    };
  }, []);

  if (!isHydrated) {
    // This prevents the component from rendering until hydration is complete
    return null;
  }

  const replayMessages = () => {
    setChartData(messages.slice(-10));
  };

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Temperature Time Series</CardTitle>
          <CardDescription>
            Real-time temperature of the device (updates every 2 seconds)
          </CardDescription>
          {/* <button onClick={replayMessages} className="mt-2">
            Replay Last 10 Messages
          </button> */}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "numeric",
                  second: "numeric",
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="temp"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "numeric",
                      second: "numeric",
                    });
                  }}
                />
              }
            />
            <Line
              dataKey="temp"
              type="monotone"
              stroke={`var(--color-temp)`}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
