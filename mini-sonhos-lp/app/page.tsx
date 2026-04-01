
import Home from "./home/page";
import FairyDustCursor from "./components/fairydust/fairydust";
import HowItWorks from "./HowItWorks/page";

export default function page() {
  return (
    <div className="bg-background">
      {/* <HowItWorks /> */}
      <Home />
      <FairyDustCursor/>
    </div>
  );
}
