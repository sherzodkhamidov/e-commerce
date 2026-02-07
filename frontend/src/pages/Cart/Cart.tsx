import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { message, Modal } from "antd";
import {
  DeleteOutlined,
  MinusOutlined,
  PlusOutlined,
  ShoppingCartOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useCart } from "../../context/CartContext";
import "./Cart.css";

export default function Cart() {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const { items, total, loading, updateQuantity, removeItem } = useCart();
  const [updating, setUpdating] = useState<number | null>(null);

  // Helper to get localized value
  const getLoc = (item: any, field: string) => {
    const lang = i18n.language === "en" ? "eng" : i18n.language;
    const key = `${field}_${lang}`;
    return item[key] || item[field] || "";
  };

  const formatPrice = (price: string | number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(typeof price === "string" ? parseFloat(price) : price);
  };

  const handleQuantityChange = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setUpdating(itemId);
    try {
      await updateQuantity(itemId, newQuantity);
    } catch (error) {
      console.error(error);
      message.error("Failed to update quantity");
    } finally {
      setUpdating(null);
    }
  };

  const handleRemove = (itemId: number) => {
    Modal.confirm({
      title: "Remove Item",
      icon: <ExclamationCircleOutlined />,
      content: "Are you sure you want to remove this item from your cart?",
      okText: "Remove",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        setUpdating(itemId);
        try {
          await removeItem(itemId);
        } catch (error) {
          console.error(error);
          message.error("Failed to remove item");
        } finally {
          setUpdating(null);
        }
      },
    });
  };

  if (loading) {
    return (
      <div className="cart-container">
        <div className="cart-header skeleton-header">
          <div
            className="skeleton skeleton-text title"
            style={{ width: "200px", height: "32px", maxWidth: "100%" }}
          ></div>
        </div>
        <div className="cart-content">
          <div className="cart-items">
            {[1, 2, 3].map((i) => (
              <div key={i} className="cart-item skeleton-cart-item">
                <div className="skeleton cart-item-image"></div>
                <div className="cart-item-details">
                  <div className="cart-item-info">
                    <div
                      className="skeleton skeleton-text small"
                      style={{ width: "120px" }}
                    ></div>
                    <div
                      className="skeleton skeleton-text medium"
                      style={{ width: "250px", marginTop: "8px" }}
                    ></div>
                    <div
                      className="skeleton skeleton-text"
                      style={{ width: "80px", marginTop: "8px" }}
                    ></div>
                  </div>
                  <div className="cart-item-actions">
                    <div
                      className="skeleton skeleton-button"
                      style={{ width: "100px", height: "36px" }}
                    ></div>
                    <div
                      className="skeleton skeleton-text"
                      style={{ width: "60px" }}
                    ></div>
                    <div
                      className="skeleton skeleton-button"
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <div
              className="skeleton skeleton-text large"
              style={{ width: "150px", marginBottom: "20px" }}
            ></div>
            <div
              className="skeleton skeleton-text"
              style={{ width: "100%", height: "16px", marginBottom: "12px" }}
            ></div>
            <div
              className="skeleton skeleton-text"
              style={{ width: "100%", height: "16px", marginBottom: "12px" }}
            ></div>
            <div
              className="skeleton skeleton-text large"
              style={{ width: "100%", height: "24px", marginTop: "16px" }}
            ></div>
            <div
              className="skeleton skeleton-button"
              style={{ width: "100%", height: "48px", marginTop: "20px" }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h1>Shopping Cart</h1>
      </div>

      {items.length === 0 ? (
        <div className="empty-cart">
          <ShoppingCartOutlined
            style={{
              fontSize: 64,
              color: "var(--text-muted)",
              marginBottom: 24,
            }}
          />
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added any products yet.</p>
          <Link to="/shop" className="shop-now-btn">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            {items.map((item) => (
              <div
                key={item.id}
                className={`cart-item ${updating === item.id ? "updating" : ""}`}
              >
                <Link
                  to={`/product/${item.product.slug}`}
                  className="cart-item-image"
                >
                  {item.product.image ? (
                    <img
                      src={item.product.image}
                      alt={getLoc(item.product, "name")}
                    />
                  ) : (
                    <div className="no-image-placeholder">
                      <ShoppingCartOutlined
                        style={{ fontSize: 32, color: "var(--text-muted)" }}
                      />
                    </div>
                  )}
                </Link>

                <div className="cart-item-details">
                  <div className="cart-item-info">
                    <span className="cart-item-category">
                      {getLoc(item.product.subcatalog?.catalog, "name")} /{" "}
                      {getLoc(item.product.subcatalog, "name")}
                    </span>
                    <Link
                      to={`/product/${item.product.slug}`}
                      className="cart-item-name"
                    >
                      {getLoc(item.product, "name")}
                    </Link>
                    <div className="cart-item-price">
                      {formatPrice(item.product.price)}
                      {item.product.old_price && (
                        <span className="old-price">
                          {formatPrice(item.product.old_price)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="cart-item-actions">
                    <div className="quantity-selector">
                      <button
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1 || updating === item.id}
                        type="button"
                      >
                        <MinusOutlined />
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity + 1)
                        }
                        disabled={
                          item.quantity >= item.product.stock ||
                          updating === item.id
                        }
                        type="button"
                      >
                        <PlusOutlined />
                      </button>
                    </div>
                    <div className="cart-item-subtotal">
                      {formatPrice(item.subtotal)}
                    </div>
                    <button
                      className="remove-item-btn"
                      onClick={() => handleRemove(item.id)}
                      disabled={updating === item.id}
                      type="button"
                      title="Remove item"
                    >
                      <DeleteOutlined />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Subtotal ({items.length} items)</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span className="free-shipping">Free</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
            <button
              className="checkout-btn"
              onClick={() => navigate("/checkout")}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
