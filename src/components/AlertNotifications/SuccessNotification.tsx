import React from "react";
import { CheckCircle, X } from "@phosphor-icons/react";

interface SuccessAlertProps {
  success: string;
  setSuccess: (value: string) => void;
}

const SuccessAlert: React.FC<SuccessAlertProps> = ({ success, setSuccess }) => {
  if (!success) return null;

  return (
    <div
      className="flex items-center justify-between border px-4 py-2 mt-4 rounded-md text-sm shadow-sm text-success"
      style={{ backgroundColor: "rgba(61, 171, 37, 0.15)", borderColor: "#3DAB25" }}
    >
      <div className="flex items-center">
        <CheckCircle size={20} weight="bold" className="mr-2 text-success" />
        <span>{success}</span>
      </div>
      <button onClick={() => setSuccess("")} className="ml-4 hover:text-green-900">
        <X size={18} weight="bold" />
      </button>
    </div>
  );
};

export default SuccessAlert;
