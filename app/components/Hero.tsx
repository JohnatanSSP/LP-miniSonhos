import Image from "next/image";
import BackgroundAnimated from "./BackgroundAnimated/BackgroundAnimated";
import Link from "next/link";

export default function Hero() {
    return (
        <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden py-16 px-4">
            <BackgroundAnimated />

            <div className="relative z-30 flex flex-col items-center justify-center text-center gap-4 sm:gap-5 w-full max-w-3xl mx-auto">
                <Image
                    src="/img/logo.png"
                    alt="Logo"
                    width={300}
                    height={300}
                    style={{ width: "auto", height: "auto" }}
                    className="w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 object-contain rounded-full"
                    priority
                />
                <p className="text-base sm:text-lg">A Magia está na surpresa</p>
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-tight">
                    Scoops <br />
                    <strong className="text-purple-700">Surpresa</strong>
                </h1>
                <p className="text-base sm:text-lg max-w-md">
                    Escolha seu scoop de micangas e descubra suas surpresas!
                </p>
                <Link href="/order" className="mt-2">
                    <button className="rounded-full py-3 px-6 sm:py-4 sm:px-8 text-lg sm:text-2xl transition duration-1000 bg-gradient-to-r from-pink-600 to-purple-700 text-white hover:bg-gradient-to-l hover:from-purple-700 hover:to-pink-600 cursor-pointer whitespace-nowrap">
                        Pedir Agora
                    </button>
                </Link>
            </div>
        </section>
    );
}
