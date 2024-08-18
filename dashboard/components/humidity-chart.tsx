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

// Initial sample data
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
  const [chartData, setChartData] = useState(initialData);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      // Generate a random temperature between 0 and 100
      const randomTemp = Math.floor(Math.random() * 101);

      setChartData([
        { type: "humidity", temp: randomTemp, fill: "var(--color-safari)" },
      ]);

      // Update the last updated time
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
            endAngle={(chartData[0].temp / 100) * 360} // Convert temp to angle (0-360)
            innerRadius={80}
            outerRadius={140}
            barSize={15} // Adjust bar thickness
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
              cornerRadius={10} // Rounded corners for the bar
              fill="var(--color-safari)"
            />
            <PolarRadiusAxis
              angle={90}
              type="number"
              domain={[0, 100]} // Limits the range to 0°C to 100°C
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
