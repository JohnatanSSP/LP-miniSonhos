import Image from "next/image";
import BackgroundAnimated from "./BackgroundAnimated/BackgroundAnimated";
import Link from "next/link";

export default function Hero() {
    return (
        <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
            {/* Background fica atrás de tudo */}
            <BackgroundAnimated />

            {/* Conteúdo fica na frente */}
            <div className="relative z-30 flex flex-col items-center justify-center text-center gap-5 px-4">
                <Image
                    src="/img/logo.png"
                    alt="Logo"
                    width={300}
                    height={300}
                    style={{ width: "auto", height: "auto" }}
                    className="object-contain rounded-full"
                    priority
                />
                <p className="text-lg">A Magia está na surpresa</p>
                <h1 className="text-8xl font-bold">
                    Scoops <br />
                    <strong className="text-purple-700">Surpresa</strong>
                </h1>
                <p className="text-lg">Escolha seu scoop de micangas e descubra suas surpresas!</p>
                <Link href="/order">
                    <button className="rounded-full py-4 px-6 text-3xl transition duration-1000 bg-gradient-to-r from-pink-600 to-purple-700 text-white hover:bg-gradient-to-l hover:from-purple-700 hover:to-pink-600 cursor-pointer">
                        Pedir Agora
                    </button>
                </Link>
            </div>
        </section>
    );
}
