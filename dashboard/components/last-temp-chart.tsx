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
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { createIoTDevice } from "@/utils/awsIoTUtils";

const chartConfig = {
  type: {
    label: "Temperature",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export default function LastTempChart() {
  const [chartData, setChartData] = useState([
    { type: "temperature", temp: 0, fill: "var(--color-safari)" },
  ]);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    const device = createIoTDevice();

    device.on("connect", () => {
      device.subscribe("things/dht11_01");
      console.log("Connected to AWS IoT!");
    });

    device.on("message", (topic: string, payload: any) => {
      const message = JSON.parse(payload.toString());
      const temperature = message.Temperature;

      setChartData([
        { type: "temperature", temp: temperature, fill: "var(--color-safari)" },
      ]);
      setLastUpdated(new Date());
    });

    device.on("error", (error: any) => {
      console.error("Error:", error);
    });

    return () => {
      device.end();
    };
  }, []);

  return (
    <Card className="flex flex-col min-h-[21rem]">
      <CardHeader className="items-center pb-0">
        <CardDescription>Real-time temperature levels</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={0}
            endAngle={(chartData[0].temp / 100) * 360} // End angle based on the temperature in °C
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
              domain={[0, 100]} // Set domain to match the temperature range
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
                          {chartData[0].temp.toLocaleString()}°C
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Temperature
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
