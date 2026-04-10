'use client'

import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { useState, useEffect } from "react";
import convertToSubcurrency from "../lib/convertToSubcurrency";


const CheckoutPage = ({ amount }: { amount: number }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState<string | null>(null);
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch('/api/create-payment-intent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ amount: convertToSubcurrency(amount) }),
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    setError(data.error);
                } else {
                    setClientSecret(data.clientSecret);
                }
            });
    }, [amount]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);

        if (!stripe || !elements) {
            setError("Stripe.js não carregou corretamente.");
            setLoading(false);
            return;
        }
        const { error: submitError } = await elements.submit();

        if (submitError) {
            setError(submitError.message || "Ocorreu um erro ao processar o pagamento.");
            setLoading(false);
            return;
        }

        const { error: confirmError } = await stripe.confirmPayment({
            elements,
            clientSecret: clientSecret!,
            confirmParams: {
                return_url: `http://localhost:3000/success?amount=${amount}`,
            },
        });

        if (error) {
            setError(confirmError?.message || "Ocorreu um erro ao confirmar o pagamento.");
            // Aqui você pode adicionar lógica para lidar com o erro, como exibir uma mensagem para o usuário ou registrar o erro para análise posterior.
            // Exemplo: console.error("Erro ao confirmar pagamento:", confirmError);
            // Você também pode considerar implementar uma lógica de retry ou oferecer opções alternativas para o usuário, dependendo do tipo de erro.
        } else {
            setError(null);
            // O pagamento foi processado com sucesso, você pode redirecionar o usuário ou exibir uma mensagem de sucesso.
            // Exemplo: window.location.href = `http://localhost:3000/success?amount=${amount}`;
            // Lembre-se de que a confirmação do pagamento pode levar algum tempo, então você pode querer mostrar um indicador de carregamento ou uma mensagem de "Processando..." enquanto aguarda a resposta do Stripe.
        }

        setLoading(false);
    };

    if (!clientSecret || !stripe || !elements) {
        return (
            <div className="flex items-center justify-center">
                <div className="inline-block h-8 animate-spin rounded-full border-4 border-s border-current border-e-transparent text-surface
                motion-reduce:animate-[spin_1.5s_linear_infinite]"
                    role="status">
                    <span className="!absolute !m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Carregando...</span>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-md p-4 bg-white rounded shadow-md">
            {clientSecret && <PaymentElement />}

            {error && <div className="text-red-500">{error}</div>}

            <button
                disabled={!stripe || loading}
                className="w-full mt-4 bg-blue-500 text-white py-2 rounded disabled:bg-gray-400">
                {loading ? "Processando..." : `Pagar R$${amount.toFixed(2)}`}
            </button>
        </form>
    )

}

export default CheckoutPage;