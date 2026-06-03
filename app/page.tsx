import CiaSection from "./components/CiaSection";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import HowItWorksSection from "./components/HowItWorksSection";
import WhatGetSection from "./components/WhatGetSection";
import WhatsAppButton from "./components/WhatsAppButton";
import WhySection from "./components/WhySection";

export default function page() {
    return (
        <div className="bg-transparent flex flex-col w-full">
            <WhatsAppButton />
            <Hero />
            <WhatGetSection />
            <HowItWorksSection />
            <WhySection />
            <CiaSection />
            <Footer />
        </div>
    );
}
