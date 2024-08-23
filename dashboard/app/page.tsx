/* eslint-disable react/no-children-prop */
"use client";
import Actions from "@/components/actions";
import Humidity from "@/components/humidity-chart";
import LastTempChart from "@/components/last-temp-chart";
import MotionCard from "@/components/motion-card";
import TempChart from "@/components/temp-chart";
import VideoStreaming from "@/components/video-streaming";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="">
      <div className="min-h-screen p-8">
        <motion.h1
          className="text-3xl font-bold mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          CEIOT-01
        </motion.h1>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, scale: 0.8 },
            visible: {
              opacity: 1,
              scale: 1,
              transition: {
                delayChildren: 0.3,
                staggerChildren: 0.2,
              },
            },
          }}
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <MotionCard title="Video Streaming" children={<VideoStreaming />} />
          </motion.div>
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <MotionCard title="Current Humidity" children={<Humidity />} />
          </motion.div>
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <MotionCard
              title="Current Temperature"
              children={<LastTempChart />}
            />
          </motion.div>
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <MotionCard title="Manual Actions" children={<Actions />} />
          </motion.div>
        </motion.div>
        <motion.div
          className="grid grid-cols-1 gap-8 my-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <MotionCard title="DHT11" children={<TempChart />} />
        </motion.div>
      </div>
    </main>
  );
}
