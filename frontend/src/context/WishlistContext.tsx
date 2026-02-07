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

interface WishlistContextType {
  wishlistIds: number[];
  loading: boolean;
  toggleWishlist: (productId: number) => Promise<boolean>;
  isInWishlist: (productId: number) => boolean;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined,
);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [wishlistIds, setWishlistIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      refreshWishlist();
    } else {
      setWishlistIds([]);
    }
  }, [isAuthenticated]);

  const refreshWishlist = async () => {
    try {
      setLoading(true);
      const response = await api.get("/wishlist/ids");
      setWishlistIds(response.data);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlist = async (productId: number): Promise<boolean> => {
    try {
      const response = await api.post(`/wishlist/${productId}`);
      const inWishlist = response.data.in_wishlist;

      if (inWishlist) {
        setWishlistIds((prev) => [...prev, productId]);
        message.success("Added to wishlist");
      } else {
        setWishlistIds((prev) => prev.filter((id) => id !== productId));
        message.info("Removed from wishlist");
      }

      return inWishlist;
    } catch (error: any) {
      const msg = error.response?.data?.message || "Failed to update wishlist";
      message.error(msg);
      throw new Error(msg);
    }
  };

  const isInWishlist = (productId: number): boolean => {
    return wishlistIds.includes(productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        loading,
        toggleWishlist,
        isInWishlist,
        refreshWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
