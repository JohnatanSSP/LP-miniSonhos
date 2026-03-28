
import Home from "./pages/Home";
import FairyDustCursor from "./components/fairydust/fairydust";
import HowItWorks from "./pages/HowItWorks";

export default function page() {
  return (
    <div className="bg-background">
      {/* <HowItWorks /> */}
      <Home />
      <FairyDustCursor/>
    </div>
  );
}
