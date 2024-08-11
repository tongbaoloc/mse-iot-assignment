import React from "react";
import { Label } from "./ui/label";
import { Switch } from "@/components/ui/switch";

const Actions = () => {
  return (
    <div className="">
      <div className="flex items-center justify-between border px-2 py-4 rounded-lg">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="email">Temperature light</Label>
          <p className="text-gray-400">
            Switch to turn on or off the temperature
          </p>
        </div>
        <Switch />
      </div>
      <div className="flex items-center justify-between border px-2 py-4 rounded-lg mt-4">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="email">Fans</Label>
          <p className="text-gray-400">Switch to turn on or off the Fans</p>
        </div>
        <Switch />
      </div>
    </div>
  );
};

export default Actions;
