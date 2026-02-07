import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Modal, message } from "antd";
import {
  HeartFilled,
  ShoppingCartOutlined,
  DeleteOutlined,
  LoadingOutlined,
  ExclamationCircleOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import api from "../../api/axios";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";
import "./Wishlist.css";

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

export default function Wishlist() {
  const { i18n } = useTranslation();
  const { toggleWishlist } = useWishlist();
  const { addToCart, items: cartItems } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  // Helper to get localized value
  const getLoc = (item: any, field: string) => {
    const lang = i18n.language === "en" ? "eng" : i18n.language;
    const key = `${field}_${lang}`;
    return item[key] || item[field] || "";
  };

  useEffect(() => {
    fetchWishlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  const fetchWishlist = async () => {
    try {
      const response = await api.get("/wishlist");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      message.error("Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(parseFloat(price));
  };

  const isInCart = (productId: number) => {
    return cartItems.some((item) => item.product.id === productId);
  };

  const handleRemove = (productId: number) => {
    Modal.confirm({
      title: "Remove from Wishlist",
      icon: <ExclamationCircleOutlined />,
      content: "Are you sure you want to remove this item from your wishlist?",
      okText: "Remove",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        setActionLoading(productId);
        try {
          await toggleWishlist(productId);
          setProducts((prev) => prev.filter((p) => p.id !== productId));
        } catch (error) {
          console.error(error);
          message.error("Failed to remove item");
        } finally {
          setActionLoading(null);
        }
      },
    });
  };

  const handleAddToCart = async (productId: number) => {
    if (isInCart(productId)) return; // Prevent adding again if already added

    setActionLoading(productId);
    try {
      await addToCart(productId);
      // message.success("Added to cart"); // Removed duplicate notification
    } catch (error) {
      console.error(error);
      message.error("Failed to add to cart");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="wishlist-container">
        <div className="wishlist-header skeleton-header">
          <div
            className="skeleton skeleton-text title"
            style={{ width: "200px" }}
          ></div>
        </div>
        <div className="wishlist-grid">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="wishlist-item skeleton-wishlist-item">
              <div className="skeleton wishlist-item-image"></div>
              <div className="wishlist-item-details">
                <div
                  className="skeleton skeleton-text small"
                  style={{ width: "60px" }}
                ></div>
                <div
                  className="skeleton skeleton-text medium"
                  style={{ width: "90%" }}
                ></div>
                <div
                  className="skeleton skeleton-text"
                  style={{ width: "80px" }}
                ></div>
              </div>
              <div className="wishlist-item-actions">
                <div
                  className="skeleton skeleton-button"
                  style={{ flex: 1 }}
                ></div>
                <div
                  className="skeleton skeleton-button"
                  style={{ width: "44px" }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-container">
      <div className="wishlist-header">
        <h1>My Wishlist</h1>
        <span className="wishlist-count">{products.length} items</span>
      </div>

      {products.length === 0 ? (
        <div className="empty-wishlist">
          <HeartFilled
            style={{
              fontSize: 64,
              color: "var(--text-muted)",
              marginBottom: 24,
            }}
          />
          <h2>Your wishlist is empty</h2>
          <p>Save items you like by clicking the heart icon on products.</p>
          <Link to="/shop" className="primary-btn-link">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="wishlist-grid">
          {products.map((product) => (
            <div
              key={product.id}
              className={`wishlist-item ${actionLoading === product.id ? "loading" : ""}`}
            >
              <Link
                to={`/product/${product.slug}`}
                className="wishlist-item-image"
              >
                {product.image ? (
                  <img src={product.image} alt={getLoc(product, "name")} />
                ) : (
                  <div className="no-image-placeholder">
                    <HeartFilled
                      style={{ fontSize: 32, color: "var(--text-muted)" }}
                    />
                  </div>
                )}
              </Link>

              <div className="wishlist-item-details">
                <span className="wishlist-item-category">
                  {getLoc(product.subcatalog?.catalog, "name")} /{" "}
                  {getLoc(product.subcatalog, "name")}
                </span>
                <Link
                  to={`/product/${product.slug}`}
                  className="wishlist-item-name"
                >
                  {getLoc(product, "name")}
                </Link>
                <div className="wishlist-item-price">
                  <span className="current-price">
                    {formatPrice(product.price)}
                  </span>
                  {product.old_price && (
                    <span className="old-price">
                      {formatPrice(product.old_price)}
                    </span>
                  )}
                </div>
                <div className="wishlist-item-stock">
                  {product.stock > 0 ? (
                    <span className="in-stock">In Stock ({product.stock})</span>
                  ) : (
                    <span className="out-of-stock">Out of Stock</span>
                  )}
                </div>
              </div>

              <div className="wishlist-item-actions">
                <button
                  className={`add-to-cart-btn ${isInCart(product.id) ? "added" : ""}`}
                  onClick={() => handleAddToCart(product.id)}
                  disabled={
                    product.stock === 0 ||
                    actionLoading === product.id ||
                    isInCart(product.id)
                  }
                >
                  {actionLoading === product.id ? (
                    <LoadingOutlined spin />
                  ) : isInCart(product.id) ? (
                    <CheckOutlined />
                  ) : (
                    <ShoppingCartOutlined />
                  )}
                  {isInCart(product.id) ? "Added" : "Add to Cart"}
                </button>
                <button
                  className="remove-wishlist-btn"
                  onClick={() => handleRemove(product.id)}
                  disabled={actionLoading === product.id}
                  title="Remove from wishlist"
                >
                  <DeleteOutlined />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
