import CiaSection from "./components/CiaSection";
import { FairyDustCursor } from "./components/fairydust/fairydust";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import WhatGetSection from "./components/WhatGetSection";
import WhatsAppButton from "./components/WhatsAppButton";
import WhySection from "./components/WhySection";

export default function page() {
    return (
        <div className="bg-transparent flex flex-col w-full">
            <WhatsAppButton />
            <Hero />
            <WhatGetSection />
            <WhySection />
            <CiaSection />
            <Footer />
            <FairyDustCursor />
        </div>
    );
}
