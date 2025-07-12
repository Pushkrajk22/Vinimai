"use client";

import { X, WarningCircle } from "@phosphor-icons/react";
import React from "react";

interface ErrorNotificationProps {
  error: string;
  setError: (value: string) => void;
}

const ErrorNotification: React.FC<ErrorNotificationProps> = ({ error, setError }) => {
  if (!error) return null;

  return (
    <div
      className="flex items-center justify-between border px-4 py-2 mt-4 rounded-md text-sm text-red border-red"
      style={{ backgroundColor: "rgba(219, 68, 68, 0.1)" }}
    >
      <div className="flex items-center">
        <WarningCircle size={20} weight="bold" className="mr-2 text-red" />
        <span>{error}</span>
      </div>
      <button onClick={() => setError("")} className="ml-4 hover:text-red-700">
        <X size={18} weight="bold" />
      </button>
    </div>
  );
};

export default ErrorNotification;
