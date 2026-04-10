import Link from "next/link";

export default function PaymentSuccess({
    searchParans: { amount },
}: {
    searchParans: {
        amount: string;
    }
}
) {

    return (
        <main className='w-full h-screen flex items-center justify-center bg-green-100'>
            <h1 className='text-2xl font-bold text-green-700'>Pagamento realizado com sucesso!</h1>
            <h2 className='text-lg text-green-600'>Obrigado por sua compra.</h2>
            
            <span>{`Valor pago: R$ ${parseFloat(amount).toFixed(2)}`}</span>
            <Link href="/" className="mt-4 inline-block bg-green-500 text-white py-2 px-4 rounded">
                Voltar para a página Inicial
            </Link>
        </main>
    )
}