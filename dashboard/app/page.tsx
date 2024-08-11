import MotionCard from "@/components/motion-card";
import { TempChart } from "@/components/temp-chart";

export default function Home() {
  return (
    <main className="">
      <div className="min-h-screen p-8">
        <h1 className="text-3xl font-bold mb-8">IoT Monitoring Dashboard</h1>
        <div className="grid grid-cols-1 gap-8">
          <MotionCard title="Performance" children={<TempChart />}>
            {/* Chart component for Performance */}
          </MotionCard>
        </div>
      </div>
    </main>
  );
}
