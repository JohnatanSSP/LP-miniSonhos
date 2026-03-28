"use client";
import { motion } from 'framer-motion';
import { FaWhatsapp } from "react-icons/fa";

const WHATSAPP_LINK = "https://wa.me/qr/326K3JISIY4AF1";

export default function WhatsAppButton() {
  return (
    <motion.a
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
        <FaWhatsapp className="w-10 h-10" />


    </motion.a>
  );
}