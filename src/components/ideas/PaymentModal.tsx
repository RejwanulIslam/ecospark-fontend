"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { X, Lock, CreditCard, CheckCircle } from "lucide-react";
import { paymentApi } from "@/lib/api";
import toast from "react-hot-toast";
import { Idea } from "@/types";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaymentModalProps {
  idea: Idea;
  onClose: () => void;
  onSuccess: () => void;
}

function CheckoutForm({ idea, onSuccess }: Omit<PaymentModalProps, "onClose">) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [paid, setPaid] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    try {
      // 1. Create payment intent
      const { data } = await paymentApi.createIntent(idea.id);
      const { clientSecret } = data;

      // 2. Confirm card payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: elements.getElement(CardElement)! },
      });

      if (error) {
        toast.error(error.message ?? "Payment failed");
        return;
      }

      if (paymentIntent?.status === "succeeded") {
        // 3. Confirm on backend
        await paymentApi.confirmPayment(paymentIntent.id, idea.id);
        setPaid(true);
        toast.success("🎉 Payment successful! You now have full access.");
        setTimeout(onSuccess, 2000);
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      toast.error(error.response?.data?.error ?? "Payment failed");
    } finally {
      setProcessing(false);
    }
  };

  if (paid) {
    return (
      <div className="flex flex-col items-center justify-center py-10 gap-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <CheckCircle className="w-20 h-20 text-primary-500" />
        </motion.div>
        <h3 className="font-display text-2xl font-bold text-gray-900 dark:text-white">Payment Successful!</h3>
        <p className="text-gray-500 dark:text-gray-400 text-center">
          You now have full access to this idea. Redirecting...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Idea summary */}
      <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Purchasing access to:</p>
        <p className="font-semibold text-gray-900 dark:text-white text-sm">{idea.title}</p>
        <p className="text-primary-600 dark:text-primary-400 font-bold text-xl mt-1">${idea.price}</p>
      </div>

      {/* Test card notice */}
      <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/50">
        <p className="text-xs text-blue-700 dark:text-blue-400 font-semibold mb-1">🧪 Test Mode</p>
        <p className="text-xs text-blue-600 dark:text-blue-300">
          Use card: <strong>4242 4242 4242 4242</strong> · Any future date · Any 3-digit CVC
        </p>
      </div>

      {/* Card Element */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
          <CreditCard size={15} /> Card Details
        </label>
        <div className="px-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "14px",
                  color: "#374151",
                  "::placeholder": { color: "#9CA3AF" },
                  fontFamily: "DM Sans, sans-serif",
                },
              },
            }}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white font-bold rounded-xl transition-colors"
      >
        {processing ? (
          <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing...</>
        ) : (
          <><Lock size={16} /> Pay ${idea.price} Securely</>
        )}
      </button>

      <p className="text-center text-xs text-gray-400 dark:text-gray-500 flex items-center justify-center gap-1.5">
        <Lock size={11} /> Secured by Stripe. Your card info is never stored.
      </p>
    </form>
  );
}

export default function PaymentModal({ idea, onClose, onSuccess }: PaymentModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
          <h2 className="font-display font-bold text-gray-900 dark:text-white text-lg">Unlock Premium Idea</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
            <X size={16} />
          </button>
        </div>
        <div className="p-5">
          <Elements stripe={stripePromise}>
            <CheckoutForm idea={idea} onSuccess={onSuccess} />
          </Elements>
        </div>
      </motion.div>
    </motion.div>
  );
}
