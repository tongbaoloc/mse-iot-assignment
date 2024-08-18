import React from "react";
import { Label } from "./ui/label";
import { Switch } from "@/components/ui/switch";

const Actions = () => {
  return (
    <div className="">
      <div className="flex items-center justify-between border px-2 py-4 rounded-lg">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label className="dark:text-inherit" htmlFor="email">
            Temperature light
          </Label>
          <p className="text-gray-400 dark:text-inherit">
            Switch to turn on/off temperature & humidity
          </p>
        </div>
        <Switch />
      </div>
      <div className="flex items-center justify-between border px-2 py-4 rounded-lg mt-4">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label className="dark:text-inherit " htmlFor="email">
            Fans
          </Label>
          <p className="text-gray-400 dark:text-inherit">
            Switch to turn on/off the fans
          </p>
        </div>
        <Switch className="dark:text-inherit" />
      </div>
    </div>
  );
};

export default Actions;
