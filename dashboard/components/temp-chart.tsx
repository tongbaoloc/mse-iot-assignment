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

// Initial chart data
const initialChartData = [
  { date: "2024-04-01T00:00:00", temp: 22 },
  { date: "2024-04-01T00:00:05", temp: 14 },
  { date: "2024-04-01T00:00:10", temp: 55 },
  { date: "2024-04-01T00:00:15", temp: 25 },
  { date: "2024-04-01T00:00:20", temp: 65 },
  { date: "2024-04-01T00:00:25", temp: 74 },
  { date: "2024-04-01T00:00:30", temp: 96 },
  { date: "2024-04-01T00:00:35", temp: 35 },
  { date: "2024-04-01T00:00:40", temp: 83 },
  { date: "2024-04-01T00:00:45", temp: 76 },
];

const chartConfig = {
  temp: {
    label: "Temperature",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function TempChart() {
  const [chartData, setChartData] = React.useState(initialChartData);

  React.useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const newTemp = Math.floor(Math.random() * 100); // Random temperature value
      const newEntry = {
        date: now.toISOString(),
        temp: newTemp,
      };

      // Update chart data by adding the new entry and keeping only the last 10 entries
      setChartData((prevData) => [...prevData, newEntry].slice(-10));
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Temperature Chart</CardTitle>
          <CardDescription>
            Real-time temperature of the device (updates every 5 seconds)
          </CardDescription>
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
