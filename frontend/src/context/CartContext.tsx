import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import api from "../api/axios";
import { useAuth } from "./AuthContext";
import { message } from "antd";

interface Product {
  id: number;
  name: string;
  name_uz?: string;
  name_ru?: string;
  name_eng?: string;
  slug: string;
  price: string;
  old_price: string | null;
  image: string | null;
  stock: number;
  subcatalog: {
    name: string;
    name_uz?: string;
    name_ru?: string;
    name_eng?: string;
    catalog: {
      name: string;
      name_uz?: string;
      name_ru?: string;
      name_eng?: string;
    };
  };
}

interface CartItem {
  id: number;
  product: Product;
  quantity: number;
  subtotal: number;
}

interface CartContextType {
  items: CartItem[];
  total: number;
  itemsCount: number;
  loading: boolean;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

import { useTranslation } from "react-i18next";

export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const { i18n } = useTranslation();
  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [itemsCount, setItemsCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      refreshCart();
    } else {
      setItems([]);
      setTotal(0);
      setItemsCount(0);
    }
  }, [isAuthenticated, i18n.language]);

  const refreshCart = async () => {
    try {
      setLoading(true);
      const response = await api.get("/cart");
      setItems(response.data.items);
      setTotal(response.data.total);
      setItemsCount(response.data.items_count);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId: number, quantity: number = 1) => {
    try {
      const response = await api.post(`/cart/${productId}`, { quantity });
      setItemsCount(response.data.items_count);
      setTotal(response.data.total);
      await refreshCart();
      message.success("Added to cart");
    } catch (error: any) {
      const msg = error.response?.data?.message || "Failed to add to cart";
      message.error(msg);
      throw new Error(msg);
    }
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    try {
      const response = await api.put(`/cart/items/${itemId}`, { quantity });
      setItemsCount(response.data.items_count);
      setTotal(response.data.total);
      await refreshCart();
      message.success("Cart updated");
    } catch (error: any) {
      const msg = error.response?.data?.message || "Failed to update cart";
      message.error(msg);
      throw new Error(msg);
    }
  };

  const removeItem = async (itemId: number) => {
    try {
      const response = await api.delete(`/cart/items/${itemId}`);
      setItemsCount(response.data.items_count);
      setTotal(response.data.total);
      await refreshCart();
      message.info("Item removed from cart");
    } catch (error: any) {
      const msg = error.response?.data?.message || "Failed to remove item";
      message.error(msg);
      throw new Error(msg);
    }
  };

  const clearCart = async () => {
    try {
      await api.delete("/cart");
      setItems([]);
      setTotal(0);
      setItemsCount(0);
      message.info("Cart cleared");
    } catch (error: any) {
      const msg = error.response?.data?.message || "Failed to clear cart";
      message.error(msg);
      throw new Error(msg);
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        total,
        itemsCount,
        loading,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
