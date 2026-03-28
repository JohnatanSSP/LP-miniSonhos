
import Image from "next/image";
import BackgroundAnimated from "./BackgroundAnimated/BackgroundAnimated";

export default function Hero() {
    return (
        <nav className="bg-transparent shadow-md  w-full h-screen flex items-start justify-center">
            <div className="max-w-7xl absolute mx-auto z-30 ">
                <div className="flex justify-around  items-center">
                    <div className="flex flex-col items-center justify-around gap-5 text-center">
                        <div className=" flex items-center justify-center">
                            <Image src="/img/logo.png" alt="Logo" width={300} height={300} className="w-100 h-100 object-contain rounded-full priority " priority loading="eager" />
                        </div>
                        <div className="flex flex-col items-center justify-center text-center gap-5"> 
                            <p className="text-center text-lg">A Magia está na surpresa</p>
                            <h1 className="text-center text-8xl font-bold">Scoops <br /><strong className="text-purple-700">Surpresa</strong></h1>
                            <p className="text-center text-lg">Escolha seu scoop de micangas e descubra suas surpresas!</p>
                        </div>
                        <div className="flex items-center justify-center gap-4">
                            <button className="rounded-full py-2 px-4 transition duration-1000 bg-gradient-to-r from-pink-600 to-purple-700 border-pink-600 text-white hover:bg-gradient-to-l hover:from-purple-700 hover:to-pink-600 hover:bg-white cursor-pointer">Pedir Agora</button>
                            <button className="rounded-full py-2 px-4 transition duration-700 bg-white text-black hover:bg-pink-600 hover:text-white cursor-pointer">Como Funciona?</button>
                        </div>
                    </div>
                </div>
            </div>
            <BackgroundAnimated />
        </nav>
    );
}
