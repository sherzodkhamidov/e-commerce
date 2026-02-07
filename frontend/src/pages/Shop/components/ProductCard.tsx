import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  HeartOutlined,
  HeartFilled,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { Button, Tooltip } from "antd";
import type { Product } from "../types";

interface ProductCardProps {
  product: Product;
  isInWishlist: (id: number) => boolean;
  toggleWishlist: (id: number) => Promise<void>;
  addToCart: (id: number) => Promise<void>;
  actionLoading: number | null;
  getLoc: (item: any, field: string) => string;
}

export default function ProductCard({
  product,
  isInWishlist,
  toggleWishlist,
  addToCart,
  actionLoading,
  getLoc,
}: ProductCardProps) {
  const { t } = useTranslation();

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(parseFloat(price));
  };

  const getDiscountPercentage = (price: string, oldPrice: string) => {
    const p = parseFloat(price);
    const op = parseFloat(oldPrice);
    return Math.round(((op - p) / op) * 100);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock > 0) {
      addToCart(product.id);
    }
  };

  return (
    <div className="product-card">
      <Link to={`/product/${product.slug}`} className="product-card-link">
        <div className="product-image-wrapper">
          {product.image ? (
            <img src={product.image} alt={getLoc(product, "name")} />
          ) : (
            <div className="no-image">{t("common.noImage")}</div>
          )}
          {product.old_price && (
            <span className="discount-badge">
              -{getDiscountPercentage(product.price, product.old_price)}%
            </span>
          )}
          {product.is_featured && (
            <span className="featured-badge">Featured</span>
          )}
          {product.stock === 0 && (
            <span className="out-of-stock-badge">Out of Stock</span>
          )}
        </div>
        <div className="product-info">
          <span className="product-category">
            {getLoc(product.subcatalog?.catalog || {}, "name")} /{" "}
            {getLoc(product.subcatalog || {}, "name")}
          </span>
          <h3 className="product-name">{getLoc(product, "name")}</h3>
          {product.short_description && (
            <p className="product-description">
              {getLoc(product, "short_description")}
            </p>
          )}
          <div className="product-price">
            <span className="current-price">{formatPrice(product.price)}</span>
            {product.old_price && (
              <span className="old-price">
                {formatPrice(product.old_price)}
              </span>
            )}
          </div>
        </div>
      </Link>
      <div className="product-card-actions">
        <Tooltip
          title={
            isInWishlist(product.id) ? t("wishlist.remove") : t("wishlist.add")
          }
        >
          <Button
            shape="circle"
            className={`product-action-btn wishlist ${isInWishlist(product.id) ? "active" : ""}`}
            icon={
              isInWishlist(product.id) ? (
                <HeartFilled style={{ color: "#ef4444" }} />
              ) : (
                <HeartOutlined />
              )
            }
            onClick={handleToggleWishlist}
            loading={actionLoading === product.id}
          />
        </Tooltip>
        <Tooltip
          title={product.stock === 0 ? t("shop.outOfStock") : t("cart.add")}
        >
          <Button
            shape="circle"
            type="primary"
            className="product-action-btn cart"
            icon={<ShoppingCartOutlined />}
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            loading={actionLoading === product.id}
          />
        </Tooltip>
      </div>
    </div>
  );
}
