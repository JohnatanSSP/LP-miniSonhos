import Image from 'next/image';
import { FaWhatsapp } from "react-icons/fa";

export default function Footer() {
    const WHATSAPP_LINK = "https://wa.me/qr/326K3JISIY4AF1";
    return (
        <footer className="py-8 sm:py-10 px-4 bg-gradient-to-t from-pink-50 to-white">
            <div className="max-w-6xl mx-auto text-center flex flex-col items-center gap-3">
                <Image
                    src="/img/logoFooter.png"
                    alt="Emily MiniSonhos"
                    width={200}
                    height={200}
                    style={{ width: "auto", height: "auto" }}
                    className="w-32 sm:w-44 object-contain rounded-full"
                />
                <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                    Emily MiniSonhos
                </div>
                <a
                    href={WHATSAPP_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-800 text-sm sm:text-base"
                >
                    <FaWhatsapp className="w-4 h-4 sm:w-5 sm:h-5" />
                    Fale conosco pelo WhatsApp
                </a>
                <p className="text-purple-500 text-xs sm:text-sm">
                    © 2026 Emily MiniSonhos.
                </p>
            </div>
        </footer>
    );
}
