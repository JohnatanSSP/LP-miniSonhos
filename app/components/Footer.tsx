import { MessageCircle } from 'lucide-react';
import Image from 'next/image';
import { FaWhatsapp } from "react-icons/fa";

export default function Footer() {
    const LOGO_URL = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/698d0981b1748898520c7b9e/8d36882cc_file_000000004754720eaaf307c3bd0b76f4.png";
    const WHATSAPP_LINK = "https://wa.me/qr/326K3JISIY4AF1";
    return (

        <footer className="py-3 bg-gradient-to-t from-pink-50 to-white">
            <div className="max-w-6xl mx-auto text-center flex flex-col items-center gap-2 ">
                <Image src="/img/logoFooter.png" alt="Emily MiniSonhos" width={300} height={300} className="w-70 h-70 object-contain rounded-full priority " />
                <div className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                    Emily MiniSonhos
                </div>
                <a
                    href={WHATSAPP_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-800"
                >
                    <FaWhatsapp className="w-5 h-5" />
                    Fale conosco pelo WhatsApp
                </a>
                <p className="text-purple-500 text-sm">
                    © 2026 Emily MiniSonhos.
                </p>
            </div>
        </footer>
    )
}