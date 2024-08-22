import Actions from "@/components/actions";
import Humidity from "@/components/humidity-chart";
import LastTempChart from "@/components/last-temp-chart";
import MotionCard from "@/components/motion-card";
import TempChart from "@/components/temp-chart";
import VideoStreaming from "@/components/video-streaming";

export default function Home() {
  return (
    <main className="">
      <div className="min-h-screen p-8 ">
        <h1 className="text-3xl font-bold mb-8">CEIOT-01</h1>
        <div className="grid grid-cols-1  md:grid-cols-2 xl:grid-cols-4 gap-8">
          <MotionCard title="Video Streaming" children={<VideoStreaming />} />
          <MotionCard title="Current Humidity" children={<Humidity />} />
          {/* TODO: add current temperature */}
          <MotionCard
            title="Current Temperature"
            children={<LastTempChart />}
          />
          {/* TODO: add current temperature */}
          <MotionCard title="Manual Actions" children={<Actions />} />
        </div>
        <div className="grid grid-cols-1 gap-8 my-8">
          <MotionCard title="DHT11" children={<TempChart />} />
        </div>
        <div className="grid grid-cols-1 gap-8 my-8"></div>
      </div>
    </main>
  );
}
