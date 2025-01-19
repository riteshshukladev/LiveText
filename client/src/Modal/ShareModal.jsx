import React from "react";
import { X } from "lucide-react";
import {
  TwitterShareButton,
  WhatsappShareButton,
  TelegramShareButton,
} from "react-share";
import { TwitterIcon, WhatsappIcon, TelegramIcon } from "react-share";

const ShareModal = ({ roomId, onClose }) => {
  const shareMessage = `Join my LiveText chat room using this key: ${roomId}`;

  const handleCopyKey = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      // Optional: Add toast notification here
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="relative z-50 bg-[#0D0D0D] border border-[#151515] rounded-xl p-6 w-80"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 text-gray-400 hover:text-gray-600 bg-white rounded-full p-1 shadow-lg"
        >
          <X size={20} />
        </button>

        <h3 className="text-white font-comfortaa mb-4 text-center">
          Share Room Key
        </h3>

        <div className="flex flex-col gap-4">
          {/* Room Key Display */}
          <div className="bg-[#151515] p-3 rounded-lg">
            <p className="text-white/70 text-sm font-comfortaa text-center select-all">
              {roomId}
            </p>
          </div>

          {/* Copy Button */}
          <button
            onClick={handleCopyKey}
            className="w-full py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors font-comfortaa"
          >
            Copy Key
          </button>

          {/* Social Share Buttons */}
          <div className="flex justify-center gap-4 mt-2">
            <WhatsappShareButton url="" title={shareMessage}
            url = {`www.webwhatsapp.com`}
            >
              <WhatsappIcon size={32} round />
            </WhatsappShareButton>

            <TelegramShareButton url="" title={shareMessage}>
              <TelegramIcon size={32} round />
            </TelegramShareButton>

            <TwitterShareButton url="" title={shareMessage}>
              <TwitterIcon size={32} round />
            </TwitterShareButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
