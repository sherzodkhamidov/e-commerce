import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { message } from "antd";
import {
  ArrowLeftOutlined,
  ShoppingCartOutlined,
  CreditCardOutlined,
  LoadingOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import LocationPicker from "../../components/LocationPicker/LocationPicker";
import "./Checkout.css";

export default function Checkout() {
  const navigate = useNavigate();
  const { items, total, refreshCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    first_name: user?.name?.split(" ")[0] || "",
    last_name: user?.name?.split(" ").slice(1).join(" ") || "",
    phone: "",
    address: "",
    location_lat: null as number | null,
    location_lng: null as number | null,
    payment_method: "cash",
    notes: "",
  });

  const formatPrice = (price: string | number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(typeof price === "string" ? parseFloat(price) : price);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLocationChange = (location: { lat: number; lng: number }) => {
    setFormData((prev) => ({
      ...prev,
      location_lat: location.lat,
      location_lng: location.lng,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/orders", formData);
      await refreshCart();
      message.success("Order placed successfully!");
      navigate(`/orders/${response.data.order.id}`, {
        state: { success: true, message: "Order placed successfully!" },
      });
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to place order";
      setError(msg);
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="checkout-container">
        <div className="empty-cart">
          <ShoppingCartOutlined
            style={{
              fontSize: 64,
              color: "var(--text-muted)",
              marginBottom: 24,
            }}
          />
          <h2>Your cart is empty</h2>
          <p>Add some products before checkout.</p>
          <Link to="/shop" className="shop-now-btn">
            Go Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      {/* Back Navigation */}
      <Link to="/cart" className="back-nav">
        <ArrowLeftOutlined />
        Back to Cart
      </Link>

      <h1>Checkout</h1>

      <form onSubmit={handleSubmit} className="checkout-form">
        <div className="checkout-content">
          <div className="checkout-sections">
            {/* Contact Information */}
            <section className="checkout-section">
              <h2>
                <span className="section-number">1</span>
                Contact Information
              </h2>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="first_name">First Name *</label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                    placeholder="John"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="last_name">Last Name *</label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                    placeholder="Doe"
                  />
                </div>
                <div className="form-group full-width">
                  <label htmlFor="phone">Phone Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="+998 90 123 45 67"
                  />
                </div>
              </div>
            </section>

            {/* Delivery Address */}
            <section className="checkout-section">
              <h2>
                <span className="section-number">2</span>
                Delivery Address
              </h2>
              <div className="form-grid">
                <div className="form-group full-width">
                  <label htmlFor="address">Address *</label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    placeholder="Street, building, apartment..."
                    rows={3}
                  />
                </div>
                <div className="form-group full-width">
                  <LocationPicker
                    value={{
                      lat: formData.location_lat,
                      lng: formData.location_lng,
                    }}
                    onChange={handleLocationChange}
                  />
                </div>
              </div>
            </section>

            {/* Payment Method */}
            <section className="checkout-section">
              <h2>
                <span className="section-number">3</span>
                Payment Method
              </h2>
              <div className="payment-methods">
                <label className="payment-option disabled" title="Coming Soon">
                  <input
                    type="radio"
                    name="payment_method"
                    value="payme"
                    checked={formData.payment_method === "payme"}
                    onChange={handleChange}
                    disabled
                  />
                  <div className="payment-option-content">
                    <div className="payment-logo payme">
                      <CreditCardOutlined />
                    </div>
                    <div className="payment-info">
                      <span className="payment-name">
                        Payme <span className="coming-soon">(Coming Soon)</span>
                      </span>
                      <span className="payment-desc">
                        Pay with your Payme card
                      </span>
                    </div>
                  </div>
                </label>

                <label
                  className={`payment-option ${
                    formData.payment_method === "cash" ? "selected" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="payment_method"
                    value="cash"
                    checked={formData.payment_method === "cash"}
                    onChange={handleChange}
                  />
                  <div className="payment-option-content">
                    <div className="payment-logo cash">
                      <WalletOutlined />
                    </div>
                    <div className="payment-info">
                      <span className="payment-name">Cash on Delivery</span>
                      <span className="payment-desc">Pay when you receive</span>
                    </div>
                  </div>
                </label>
              </div>
            </section>

            {/* Order Notes */}
            <section className="checkout-section">
              <h2>
                <span className="section-number">4</span>
                Additional Notes
              </h2>
              <div className="form-group full-width">
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Any special instructions for your order..."
                  rows={4}
                />
              </div>
            </section>
          </div>

          {/* Order Summary */}
          <div className="order-summary-sidebar">
            <div className="order-summary-sticky">
              <h2>Order Summary</h2>

              <div className="summary-items">
                {items.map((item) => (
                  <div key={item.id} className="summary-item">
                    <div className="summary-item-image">
                      {item.product.image ? (
                        <img src={item.product.image} alt={item.product.name} />
                      ) : (
                        <div className="no-image-small"></div>
                      )}
                      <span className="item-quantity">{item.quantity}</span>
                    </div>
                    <div className="summary-item-info">
                      <span className="item-name">{item.product.name}</span>
                      <span className="item-price">
                        {formatPrice(item.subtotal)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="summary-totals">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span className="free">Free</span>
                </div>
                <div className="summary-row total">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              {error && <div className="checkout-error">{error}</div>}

              <button
                type="submit"
                className="place-order-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <LoadingOutlined spin style={{ marginRight: 8 }} />
                    Processing...
                  </>
                ) : (
                  <>Place Order</>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
