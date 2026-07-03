import { z } from "zod";

export const checkoutSchema = z.object({
  fullName: z.string().min(3, "Вкажіть ім'я та прізвище"),
  phone: z
    .string()
    .regex(/^\+?3?8?0\d{9}$/, "Формат: +380XXXXXXXXX"),
  email: z.email("Некоректний email"),
  city: z.string().min(2, "Вкажіть місто"),
  address: z.string().min(5, "Вкажіть вулицю та будинок"),
  postalCode: z.string().min(3, "Вкажіть відділення / індекс"),
  shippingMethod: z.enum(["nova_poshta", "ukrposhta", "courier"]),
  paymentMethod: z.enum(["card", "cod"]),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export const SHIPPING_FEES: Record<CheckoutFormValues["shippingMethod"], number> = {
  nova_poshta: 90,
  ukrposhta: 60,
  courier: 150,
};

export const SHIPPING_LABELS: Record<CheckoutFormValues["shippingMethod"], string> = {
  nova_poshta: "Нова пошта",
  ukrposhta: "Укрпошта",
  courier: "Кур'єром по місту",
};
