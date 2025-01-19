import React from "react";
import { X } from "lucide-react";

const ErrorModal = ({ error, clearError }) => {
  if (!error) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      onClick={clearError}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

      {/* Modal Content */}
      <div 
        className="relative z-[101] flex flex-col gap-4 p-8 text-white border border-solid border-red-500 rounded-2xl bg-black/30 backdrop-blur-md animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={clearError}
          className="absolute -top-2 -right-2 text-gray-400 hover:text-gray-600 bg-white rounded-full p-1 shadow-lg"
        >
          <X size={20} />
        </button>

        <div className="text-center">
          <h3 className="text-red-500 font-comfortaa text-lg mb-2">
            {error.title}
          </h3>
          <p className="text-white font-comfortaa text-sm">
            {error.message}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;