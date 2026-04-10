'use client'

import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { useState, useEffect } from "react";
import convertToSubcurrency from "../lib/convertToSubcurrency";
import { Form } from "lucide-react";

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

    return (
        <Form className="w-full max-w-md p-4 bg-white rounded shadow-md">
            {clientSecret && <PaymentElement  /> }
            {error && <div className="text-red-500">{error}</div>}
            <button className="w-full mt-4 bg-blue-500 text-white py-2 rounded disabled:bg-gray-400">
                Pagamento
            </button>
        </Form>
    )

}

export default CheckoutPage;