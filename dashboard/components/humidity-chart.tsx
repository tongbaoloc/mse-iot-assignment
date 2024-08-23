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
import { createIoTDevice } from "@/utils/awsIoTUtils"; // Assume this utility sets up the IoT connection
import { motion } from "framer-motion";

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
  const [chartData, setChartData] = useState([
    { type: "humidity", temp: 0, fill: "var(--color-safari)" },
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
      const humidity = message.Humidity;

      setChartData([
        { type: "humidity", temp: humidity, fill: "var(--color-safari)" },
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="flex flex-col min-h-[21rem]">
        <CardHeader className="items-center pb-0">
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <CardDescription>Real-time humidity levels</CardDescription>
          </motion.div>
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
                        <motion.text
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5, delay: 0.2 }}
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
                        </motion.text>
                      );
                    }
                  }}
                />
              </PolarRadiusAxis>
            </RadialBarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="leading-none text-muted-foreground"
          >
            Updated at {lastUpdated.toLocaleTimeString()}
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
