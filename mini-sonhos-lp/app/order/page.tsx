import Link from "next/link";


export default function page() {

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100">
      <h1 className="text-4xl font-bold text-center mt-10">Página de Pedido</h1>
      <Link href="/home">
        <button className="rounded-full py-4 px-6 text-3xl transition duration-1000 bg-gradient-to-r from-pink-600 to-purple-700 border-pink-600 text-white hover:bg-gradient-to-l hover:from-purple-700 hover:to-pink-600 hover:bg-white cursor-pointer">Voltar para Home</button>
      </Link>
    </div>
  )
}