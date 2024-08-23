"use client";

import React, { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Loader } from "lucide-react";
import { motion } from "framer-motion";

const API_URL = "https://db2c-125-235-236-53.ngrok-free.app/index";

const VideoStreaming = () => {
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchVideoStream = async () => {
      if (isCameraOn) {
        setIsLoading(true);
        try {
          const response = await fetch(API_URL, {
            headers: {
              "ngrok-skip-browser-warning": "true",
            },
          });
          const videoBlob = await response.blob();
          setVideoSrc(URL.createObjectURL(videoBlob));
        } catch (error) {
          console.error("Error fetching video stream:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setVideoSrc(null);
      }
    };

    fetchVideoStream();
  }, [isCameraOn]);

  return (
    <motion.div
      className="min-h-[21rem] border rounded-lg flex flex-col items-center justify-center"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {videoSrc ? (
        <motion.video
          src={videoSrc}
          autoPlay
          controls
          className="rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
      ) : (
        <div className="dark:text-gray-200">
          {isCameraOn ? (
            <motion.div
              className="flex items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Loader size={48} />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              Camera is off
            </motion.div>
          )}
        </div>
      )}
      <motion.div
        className="flex mt-4 border px-2 py-4 rounded-lg"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Switch checked={isCameraOn} onCheckedChange={setIsCameraOn} />
        <label className="ml-2 dark:text-gray-300">
          Turn {isCameraOn ? "Off" : "On"} Camera
        </label>
      </motion.div>
    </motion.div>
  );
};

export default VideoStreaming;
