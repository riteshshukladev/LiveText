import React, { useState } from "react";
import { useSocket } from "../Context/SocketContext";
import { X, ArrowRight } from "lucide-react";

const NameModal = () => {
  const [name, setName] = useState("");
  const { handleNewNameSubmit, onSkip, setShowNameModal } = useSocket();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name) {
      onSkip();
      return;
    }
    handleNewNameSubmit(name);
  };

  const closeNameSubmitModal = (e) => {
    e.preventDefault();
    setShowNameModal(false);
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      setShowNameModal(false);
    }
  };

  const handleModalClick = (e) => {
    e.stopPropagation();
  };
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center w-full h-full"
      onClick={handleOverlayClick}
    >
      <div className="absolute inset-0 bg-opacity-10 backdrop-blur-sm"></div>
      <div
        className="relative z-50 flex flex-col gap-4 py-56 px-8 text-white border border-solid border-white rounded-2xl bg-black bg-opacity-30 backdrop-blur-sm"
        onClick={handleModalClick}
      >
        <button
          onClick={closeNameSubmitModal}
          className="absolute top-2 right-2"
        >
          <X size={20} />
        </button>

        <h2 className="font-comfortaa font-extralight pl-3 tracking-wide md:text-base">
          What you want to be called?
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="relative">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name please"
              className="lg:w-72 py-4 px-4 pr-24 bg-transparent border border-solid border-white rounded-full font-comfortaa font-light md:text-sm focus:outline-none"
            />
            {name && name.trim() && (
              <button
                type="submit"
                onClick={handleSubmit}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 text-sm font-comfortaa text-white hover:bg-white/80 rounded-full transition-all duration-300 ease-in-out bg-white opacity-0 translate-x-2 animate-fade-in"
              >
                <ArrowRight size={18} className="text-black" />
              </button>
            )}
          </div>
        </form>

        {(!name || !name.trim()) && (
          <button
            type="button"
            className={`absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-sm font-comfortaa text-black py-5 px-4 bg-white rounded-full w-fit transition-all duration-300 ease-in-out ${
              !name || !name.trim()
                ? "animate-fade-position"
                : "animate-fade-out-position"
            }`}
            onClick={onSkip}
          >
            skip
          </button>
        )}
      </div>
    </div>
  );
};

export default NameModal;
