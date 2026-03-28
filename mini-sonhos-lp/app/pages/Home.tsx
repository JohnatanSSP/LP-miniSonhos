
import CiaSection from "../components/CiaSection";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import WhatGetSection from "../components/WhatGetSection";
import WhatsAppButton from "../components/WhatsAppButton";
import WhySection from "../components/WhySection";
export default function Home() {
    return (
        <div className="bg-transparent">
            
            <WhatsAppButton />
            <Hero  />
            <WhySection />
            <WhatGetSection />
            <CiaSection />
            <Footer />

        </div>
    );  
}