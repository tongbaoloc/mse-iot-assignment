"use client";

import React, { useEffect, useState } from "react";
import { Label } from "./ui/label";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";

const API_URL = "https://b347-125-235-236-53.ngrok-free.app";

const Actions = () => {
  const [deviceStatus, setDeviceStatus] = useState({
    fan: 0,
    motor: 0,
    temperature_light: 0,
  });

  useEffect(() => {
    // Fetch the initial status of the devices
    const fetchStatus = async () => {
      try {
        const response = await fetch(`${API_URL}/status`, {
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        });
        const data = await response.json();
        setDeviceStatus(data);
      } catch (error) {
        console.error("Failed to fetch device status:", error);
      }
    };

    fetchStatus();
    setInterval(fetchStatus, 5000);
  }, []);

  const handleSwitchChange = async (device: keyof typeof deviceStatus) => {
    const newStatus = deviceStatus[device] === 1 ? 0 : 1;
    const action = newStatus === 1 ? "On" : "Off";

    let deviceUrl = "";

    if (device === "temperature_light") {
      deviceUrl = "light_control";
    } else if (device === "fan") {
      deviceUrl = "fan_control";
    } else if (device === "motor") {
      deviceUrl = "motor_control";
    }

    try {
      const response = await fetch(`${API_URL}/${deviceUrl}?action=${action}`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
        method: "GET",
      });

      if (response.ok) {
        setDeviceStatus((prevStatus) => ({
          ...prevStatus,
          [device]: newStatus,
        }));
      } else {
        console.error("Failed to update device status");
      }
    } catch (error) {
      console.error("Error updating device status:", error);
    }
  };

  return (
    <motion.div
      className="min-h-[21rem]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="flex items-center justify-between border px-2 py-4 rounded-lg"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label className="dark:text-inherit" htmlFor="temperature_light">
            Temperature light
          </Label>
          <p className="text-gray-400 dark:text-inherit">
            Switch to turn on/off temperature & humidity
          </p>
        </div>
        <Switch
          checked={deviceStatus.temperature_light === 1}
          onCheckedChange={() => handleSwitchChange("temperature_light")}
        />
      </motion.div>
      <motion.div
        className="flex items-center justify-between border px-2 py-4 rounded-lg mt-4"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label className="dark:text-inherit " htmlFor="fan">
            Fan - 1
          </Label>
          <p className="text-gray-400 dark:text-inherit">
            Switch to turn on/off the fan
          </p>
        </div>
        <Switch
          checked={deviceStatus.fan === 1}
          onCheckedChange={() => handleSwitchChange("fan")}
        />
      </motion.div>
      <motion.div
        className="flex items-center justify-between border px-2 py-4 rounded-lg mt-4"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label className="dark:text-inherit " htmlFor="motor">
            Motor - 1
          </Label>
          <p className="text-gray-400 dark:text-inherit">
            Switch to turn on/off the motor
          </p>
        </div>
        <Switch
          checked={deviceStatus.motor === 1}
          onCheckedChange={() => handleSwitchChange("motor")}
        />
      </motion.div>
    </motion.div>
  );
};

export default Actions;
