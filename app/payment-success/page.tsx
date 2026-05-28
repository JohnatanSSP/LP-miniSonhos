import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default async function PaymentSuccess({
  searchParams,
}: {
  searchParams: Promise<{ amount?: string; paymentId?: string }>;
}) {
  const { amount, paymentId } = await searchParams;

  return (
    <main className="w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 p-6">
      <div className="bg-white rounded-3xl p-10 shadow-sm border border-purple-100 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>

        <h1 className="text-3xl font-bold text-purple-900 mb-2">
          Pagamento confirmado! 🎉
        </h1>
        <p className="text-purple-400 mb-6">
          Obrigado pela sua compra. Sua surpresa está sendo preparada com muito carinho!
        </p>

        {amount && (
          <p className="text-2xl font-bold text-purple-700 mb-4">
            R$ {parseFloat(amount).toFixed(2)}
          </p>
        )}

        {paymentId && (
          <p className="text-xs text-gray-400 mb-6">
            ID do pagamento:{" "}
            <code className="bg-gray-100 px-2 py-1 rounded">{paymentId}</code>
          </p>
        )}

        <Link
          href="/"
          className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-8 rounded-2xl font-semibold hover:from-purple-600 hover:to-pink-600 transition shadow"
        >
          Voltar ao início
        </Link>
      </div>
    </main>
  );
}
