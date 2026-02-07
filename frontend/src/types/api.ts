export interface Product {
  id: number;
  subcatalog_id: number;
  name: string;
  name_uz: string;
  name_ru: string;
  name_eng: string;
  slug: string;
  short_description: string;
  short_description_uz: string;
  short_description_ru: string;
  short_description_eng: string;
  description: string;
  description_uz: string;
  description_ru: string;
  description_eng: string;
  price: number;
  old_price: number | null;
  sku: string;
  stock: number;
  image: string | null;
  gallery: string[];
  is_active: boolean;
  is_featured: boolean;
  sort_order: number;
  discount_percentage: number | null;
  subcatalog?: Subcatalog;
}

export interface Subcatalog {
  id: number;
  catalog_id: number;
  name: string;
  name_uz: string;
  name_ru: string;
  name_eng: string;
  slug: string;
  image: string | null;
  is_active: boolean;
  sort_order: number;
  products_count?: number;
  catalog?: Catalog;
}

export interface Catalog {
  id: number;
  name: string;
  name_uz: string;
  name_ru: string;
  name_eng: string;
  slug: string;
  image: string | null;
  is_active: boolean;
  sort_order: number;
  subcatalogs_count?: number;
  subcatalogs?: Subcatalog[];
}

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
  subtotal: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  items_count: number;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  product_sku: string;
  price: number;
  quantity: number;
  subtotal: number;
  product?: Product;
}

export interface Order {
  id: number;
  order_number: string;
  user_id: number;
  subtotal: number;
  shipping_cost: number;
  tax: number;
  total: number;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod;
  shipping_name: string;
  shipping_phone: string;
  shipping_address: string;
  shipping_city: string;
  shipping_region: string | null;
  shipping_postal_code: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export type PaymentMethod = "payme" | "cash";

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface ApiPaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}
