import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ShoppingOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CarOutlined,
  GiftOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { Card, Empty, Button, Tag, Pagination, Skeleton, Avatar } from "antd";
import api from "../../api/axios";
import "./Orders.css";

interface OrderItem {
  id: number;
  product_name: string;
  price: string;
  quantity: number;
  subtotal: string;
  product: {
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
  total: string;
  items: OrderItem[];
  created_at: string;
}

interface PaginatedOrders {
  data: Order[];
  current_page: number;
  last_page: number;
  total: number;
}

const formatPrice = (price: string) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(parseFloat(price));
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getStatusConfig = (status: string) => {
  const configs: Record<string, { color: string; icon: React.ReactNode }> = {
    pending: { color: "warning", icon: <ClockCircleOutlined /> },
    confirmed: { color: "processing", icon: <CheckCircleOutlined /> },
    processing: { color: "purple", icon: <GiftOutlined /> },
    shipped: { color: "blue", icon: <CarOutlined /> },
    delivered: { color: "success", icon: <CheckCircleOutlined /> },
    cancelled: { color: "error", icon: <CloseCircleOutlined /> },
  };
  return configs[status] || { color: "default", icon: <ClockCircleOutlined /> };
};

export default function Orders() {
  const { t } = useTranslation();
  const [orders, setOrders] = useState<PaginatedOrders | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchOrders();
  }, [page]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/orders?page=${page}`);
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !orders) {
    return (
      <div className="orders-page page-container">
        <div className="orders-header">
          <Skeleton.Input active style={{ width: 150 }} />
        </div>
        <div className="orders-list">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="order-card">
              <Skeleton active avatar paragraph={{ rows: 2 }} />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page page-container">
      <div className="orders-header">
        <div className="header-title">
          <h1>{t("orders.title") || "My Orders"}</h1>
          {orders && (
            <span className="order-count">
              {orders.total} {t("orders.orders") || "orders"}
            </span>
          )}
        </div>
      </div>

      {!orders || orders.data.length === 0 ? (
        <Card className="empty-card">
          <Empty
            image={<ShoppingOutlined className="empty-icon" />}
            description={
              <div className="empty-text">
                <h3>{t("orders.empty") || "No orders yet"}</h3>
                <p>
                  {t("orders.emptyDesc") ||
                    "When you place an order, it will appear here."}
                </p>
              </div>
            }
          >
            <Link to="/shop">
              <Button type="primary" size="large">
                {t("orders.startShopping") || "Start Shopping"}
              </Button>
            </Link>
          </Empty>
        </Card>
      ) : (
        <>
          <div className="orders-list">
            {orders.data.map((order) => {
              const statusConfig = getStatusConfig(order.status);
              return (
                <Link
                  to={`/orders/${order.id}`}
                  key={order.id}
                  className="order-card-link"
                >
                  <Card className="order-card" hoverable>
                    <div className="order-card-header">
                      <div className="order-info">
                        <span className="order-number">
                          {order.order_number}
                        </span>
                        <span className="order-date">
                          {formatDate(order.created_at)}
                        </span>
                      </div>
                      <Tag color={statusConfig.color} icon={statusConfig.icon}>
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </Tag>
                    </div>

                    <div className="order-items">
                      <Avatar.Group maxCount={4} size={48}>
                        {order.items.map((item) => (
                          <Avatar
                            key={item.id}
                            src={item.product?.image}
                            shape="square"
                            className="item-avatar"
                          >
                            {item.product_name.charAt(0)}
                          </Avatar>
                        ))}
                      </Avatar.Group>
                    </div>

                    <div className="order-card-footer">
                      <span className="items-count">
                        {order.items.length}{" "}
                        {order.items.length === 1 ? "item" : "items"}
                      </span>
                      <span className="order-total">
                        {formatPrice(order.total)}
                      </span>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>

          {orders.last_page > 1 && (
            <div className="pagination-wrapper">
              <Pagination
                current={page}
                total={orders.total}
                pageSize={10}
                onChange={setPage}
                showSizeChanger={false}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
