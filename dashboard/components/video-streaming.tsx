"use client";

import React, { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Loader, LoaderCircle, LoaderPinwheel, VideoOff } from "lucide-react";
import { motion } from "framer-motion";

const API_URL = "http://192.168.2.16:5000";
// const API_URL = "https://db2c-125-235-236-53.ngrok-free.app/index";

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
          <iframe
            src="http://192.168.2.16:5000/index"
            title="Video Stream"
            style={{ width: "100%", height: "100%" }}
            className="rounded-lg"/>
        </div>
      )}
    </motion.div>
  );
};

export default VideoStreaming;
