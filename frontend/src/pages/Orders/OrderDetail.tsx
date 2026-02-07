import { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
  EnvironmentOutlined,
  CreditCardOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import {
  Card,
  Steps,
  Tag,
  Button,
  Skeleton,
  Alert,
  Divider,
  Avatar,
  Modal,
  message,
} from "antd";
import api from "../../api/axios";
import "./OrderDetail.css";

interface OrderItem {
  id: number;
  product_name: string;
  product_sku: string | null;
  price: string;
  quantity: number;
  subtotal: string;
  product: {
    id: number;
    slug: string;
    image: string | null;
  };
}

interface Order {
  id: number;
  order_number: string;
  status: string;
  payment_status: string;
  payment_method: string;
  subtotal: string;
  shipping_cost: string;
  tax: string;
  total: string;
  first_name: string;
  last_name: string;
  phone: string;
  address: string;
  location_lat: number | null;
  location_lng: number | null;
  notes: string | null;
  items: OrderItem[];
  created_at: string;
  delivered_at: string | null;
}

const formatPrice = (price: string) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(parseFloat(price));
};

const formatDate = (dateString: string | null) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusStep = (status: string): number => {
  const steps = ["pending", "processing", "delivered"];
  return steps.indexOf(status);
};

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const successMessage = location.state?.message;

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const response = await api.get(`/orders/${id}`);
      setOrder(response.data);
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    setCancelling(true);
    try {
      await api.post(`/orders/${id}/cancel`);
      setShowCancelModal(false);
      message.success("Order cancelled successfully");
      await fetchOrder();
    } catch (error: any) {
      message.error(error.response?.data?.message || "Failed to cancel order");
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="order-detail-page">
        <Skeleton active paragraph={{ rows: 1 }} />
        <Card className="progress-card">
          <Skeleton active />
        </Card>
        <div className="order-content">
          <Card className="items-card">
            <Skeleton active avatar paragraph={{ rows: 3 }} />
          </Card>
          <div className="sidebar">
            <Card>
              <Skeleton active paragraph={{ rows: 4 }} />
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-detail-page">
        <Card>
          <Alert
            message="Order not found"
            description="The order you're looking for doesn't exist."
            type="error"
            showIcon
            action={
              <Link to="/orders">
                <Button>Back to Orders</Button>
              </Link>
            }
          />
        </Card>
      </div>
    );
  }

  const stepItems = [
    { title: "Pending", icon: <ClockCircleOutlined /> },
    { title: "Processing", icon: <SyncOutlined /> },
    { title: "Delivered", icon: <CheckCircleOutlined /> },
  ];

  return (
    <div className="order-detail-page">
      {successMessage && (
        <Alert
          message={successMessage}
          type="success"
          showIcon
          closable
          className="success-alert"
        />
      )}

      {/* Header */}
      <div className="order-header">
        <div className="header-left">
          <Link to="/orders" className="back-link">
            <ArrowLeftOutlined />
            <span>Back to Orders</span>
          </Link>
          <h1>Order {order.order_number}</h1>
          <p className="order-date">Placed on {formatDate(order.created_at)}</p>
        </div>
        {order.status === "pending" && (
          <Button danger onClick={() => setShowCancelModal(true)}>
            Cancel Order
          </Button>
        )}
      </div>

      {/* Progress Steps */}
      {order.status !== "cancelled" ? (
        <Card className="progress-card">
          <Steps
            current={getStatusStep(order.status)}
            items={stepItems}
            responsive={false}
            className="order-steps"
          />
        </Card>
      ) : (
        <Alert
          message="This order has been cancelled"
          type="error"
          showIcon
          icon={<CloseCircleOutlined />}
          className="cancelled-alert"
        />
      )}

      {/* Content */}
      <div className="order-content">
        {/* Items Card */}
        <Card title={`Items (${order.items.length})`} className="items-card">
          <div className="items-list">
            {order.items.map((item) => (
              <div key={item.id} className="order-item">
                <Link
                  to={`/product/${item.product.slug}`}
                  className="item-image"
                >
                  <Avatar
                    src={item.product.image}
                    shape="square"
                    size={72}
                    className="product-avatar"
                  >
                    {item.product_name.charAt(0)}
                  </Avatar>
                </Link>
                <div className="item-info">
                  <Link
                    to={`/product/${item.product.slug}`}
                    className="item-name"
                  >
                    {item.product_name}
                  </Link>
                  {item.product_sku && (
                    <span className="item-sku">SKU: {item.product_sku}</span>
                  )}
                  <div className="item-pricing">
                    <span className="unit-price">
                      {formatPrice(item.price)} × {item.quantity}
                    </span>
                    <span className="subtotal">
                      {formatPrice(item.subtotal)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Sidebar */}
        <div className="sidebar">
          {/* Order Summary */}
          <Card title="Order Summary" className="summary-card" size="small">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>
                {parseFloat(order.shipping_cost) === 0
                  ? "Free"
                  : formatPrice(order.shipping_cost)}
              </span>
            </div>
            {parseFloat(order.tax) > 0 && (
              <div className="summary-row">
                <span>Tax</span>
                <span>{formatPrice(order.tax)}</span>
              </div>
            )}
            <Divider style={{ margin: "12px 0" }} />
            <div className="summary-row total">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </Card>

          {/* Delivery Address */}
          <Card
            title={
              <span>
                <EnvironmentOutlined /> Delivery Address
              </span>
            }
            className="address-card"
            size="small"
          >
            <p className="shipping-name">
              {order.first_name} {order.last_name}
            </p>
            <p>{order.phone}</p>
            <p>{order.address}</p>
            {order.location_lat && order.location_lng && (
              <p className="location-coords">
                📍 {Number(order.location_lat).toFixed(6)},{" "}
                {Number(order.location_lng).toFixed(6)}
              </p>
            )}
          </Card>

          {/* Payment Info */}
          <Card
            title={
              <span>
                <CreditCardOutlined /> Payment
              </span>
            }
            className="payment-card"
            size="small"
          >
            <div className="payment-row">
              <span>Method</span>
              <span>
                {order.payment_method === "payme"
                  ? "Payme"
                  : "Cash on Delivery"}
              </span>
            </div>
            <div className="payment-row">
              <span>Status</span>
              <Tag
                color={order.payment_status === "paid" ? "success" : "warning"}
              >
                {order.payment_status.charAt(0).toUpperCase() +
                  order.payment_status.slice(1)}
              </Tag>
            </div>
          </Card>

          {/* Notes */}
          {order.notes && (
            <Card
              title={
                <span>
                  <FileTextOutlined /> Notes
                </span>
              }
              className="notes-card"
              size="small"
            >
              <p>{order.notes}</p>
            </Card>
          )}
        </div>
      </div>

      {/* Cancel Modal */}
      <Modal
        title="Cancel Order"
        open={showCancelModal}
        onCancel={() => setShowCancelModal(false)}
        onOk={handleCancelOrder}
        okText="Yes, Cancel Order"
        okButtonProps={{ danger: true, loading: cancelling }}
        cancelText="No, Keep Order"
      >
        <p>Are you sure you want to cancel this order?</p>
        <p style={{ color: "rgba(0,0,0,0.45)", fontSize: 14 }}>
          This action cannot be undone. The items will be returned to stock.
        </p>
      </Modal>
    </div>
  );
}
