export type ProductStatus = "in_stock" | "low_stock" | "sold_out" | "preorder";

export type Product = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  currency: "USD";
  category: string;
  tags: string[];
  status: ProductStatus;
  stock: number;
  images: string[];
  accent: string;
  size: "sm" | "md" | "lg";
  variants?: { label: string; options: string[] }[];
};

export type CartLine = {
  productId: string;
  slug: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
  selectedVariants?: Record<string, string>;
};

export type Coupon = {
  code: string;
  kind: "percent" | "fixed";
  value: number;
  minSubtotal?: number;
};

export type OrderStatus =
  | "pending_payment"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type OrderAddress = {
  fullName: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  postalCode: string;
};

export type Order = {
  id: string;
  createdAt: string;
  status: OrderStatus;
  lines: CartLine[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  couponCode?: string;
  shippingMethod: "standard" | "express" | "courier";
  paymentMethod: "card" | "cod";
  address: OrderAddress;
};

export type ApiError = {
  error: string;
  fields?: Record<string, string>;
};
