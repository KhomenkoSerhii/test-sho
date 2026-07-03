import { z } from "zod";

export const checkoutSchema = z.object({
  fullName: z.string().min(3, "Enter your full name"),
  phone: z.string().regex(/^\+?[1-9]\d{7,14}$/, "Enter a valid phone number"),
  email: z.email("Enter a valid email"),
  city: z.string().min(2, "Enter your city"),
  address: z.string().min(5, "Enter your street and house number"),
  postalCode: z.string().min(3, "Enter your postal code"),
  shippingMethod: z.enum(["standard", "express", "courier"]),
  paymentMethod: z.enum(["card", "cod"]),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export const SHIPPING_FEES: Record<CheckoutFormValues["shippingMethod"], number> = {
  standard: 6,
  express: 15,
  courier: 12,
};

export const SHIPPING_LABELS: Record<CheckoutFormValues["shippingMethod"], string> = {
  standard: "Standard shipping",
  express: "Express shipping",
  courier: "Local courier",
};
