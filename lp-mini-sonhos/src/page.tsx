import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Emily MiniSonhos
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Sorpresas, miçangas y detalles hechos con amor para regalar 💝
          </p>
          <a
  href="https://wa.me/5511973442578"
  target="_blank"
  rel="noopener noreferrer"
  className="mt-4 inline-flex items-center justify-center rounded-full bg-green-500 px-6 py-3 text-base font-medium text-white transition hover:bg-green-600"
>
  Fazer pedido pelo WhatsApp 💚
</a>

        </div>
      </main>
    </div>
  );
}
