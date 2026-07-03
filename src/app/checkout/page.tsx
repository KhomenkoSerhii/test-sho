import { CheckoutForm } from "@/components/checkout-form";

export const metadata = { title: "Оформлення замовлення — Terra Studio" };

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="font-display text-4xl md:text-5xl">Оформлення замовлення</h1>
      <div className="mt-10">
        <CheckoutForm />
      </div>
    </div>
  );
}
