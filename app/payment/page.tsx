'use client'
import CheckoutPage from '../components/ChackoutPage';
import convertToSubcurrency from '../lib/convertToSubcurrency';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

if(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
    throw new Error('Stripe public key is not defined in environment variables');
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);



export default function Payment() {

    const amount = 95.00; // Example amount, you can replace this with your actual amount

    return (
        <main className='w-full h-screen flex items-center justify-center bg-pink-100'>
            <h1>Payment</h1>
            <span className='text-sm text-gray-500'>Preco: {amount}</span>

            <Elements
                stripe={stripePromise}
                options={{
                    mode:'payment',
                    amount:convertToSubcurrency(amount),
                    currency:'brl',
                }
                }
            >
                <CheckoutPage amount={amount} />
            </Elements>
        </main>
    )
}