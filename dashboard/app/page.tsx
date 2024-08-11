import Actions from "@/components/actions";
import Humidity from "@/components/humidity-chart";
import MotionCard from "@/components/motion-card";
import { TempChart } from "@/components/temp-chart";

export default function Home() {
  return (
    <main className="">
      <div className="min-h-screen p-8">
        <h1 className="text-3xl font-bold mb-8">IoT Monitoring Dashboard</h1>
        <div className="grid grid-cols-1 gap-8 mb-8">
          <MotionCard title="DHT11/DHT12" children={<TempChart />} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <MotionCard title="Humidity" children={<Humidity />} />
          <MotionCard title="Actions" children={<Actions />} />
        </div>
      </div>
    </main>
  );
}
