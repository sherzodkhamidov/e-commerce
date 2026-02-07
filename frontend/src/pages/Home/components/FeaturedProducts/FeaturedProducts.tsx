import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Badge, Skeleton } from "antd";
import { ArrowRightOutlined, PictureOutlined } from "@ant-design/icons";
import {
  getLoc,
  formatPrice,
  getDiscountPercentage,
  type Product,
} from "../../types";
import "./FeaturedProducts.css";

interface FeaturedProductsProps {
  products: Product[];
  loading?: boolean;
}

export default function FeaturedProducts({
  products,
  loading = false,
}: FeaturedProductsProps) {
  const { t, i18n } = useTranslation();

  const skeletonCards = Array.from({ length: 8 }, (_, index) => (
    <div key={index} className="product-card skeleton-card">
      <div className="product-image-wrapper">
        <Skeleton.Image active className="skeleton-product-image" />
      </div>
      <div className="product-info">
        <Skeleton.Input active size="small" className="skeleton-category" />
        <Skeleton.Input active className="skeleton-name" />
        <Skeleton.Input active size="small" className="skeleton-price" />
      </div>
    </div>
  ));

  return (
    <section className="featured-section page-container">
      <div className="section-header">
        <h2>{t("home.featuredProducts")}</h2>
        <Link to="/shop?featured=1" className="view-all-link">
          {t("home.viewAll")}
          <ArrowRightOutlined />
        </Link>
      </div>
      <div className="products-grid">
        {loading
          ? skeletonCards
          : products.map((product) => (
              <Link
                to={`/product/${product.slug}`}
                key={product.id}
                className="product-card"
              >
                <div className="product-image-wrapper">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={getLoc(product, "name", i18n.language)}
                    />
                  ) : (
                    <div className="no-image">
                      <PictureOutlined className="no-image-icon" />
                    </div>
                  )}
                  {product.old_price && (
                    <span className="discount-badge">
                      -{getDiscountPercentage(product.price, product.old_price)}
                      %
                    </span>
                  )}
                  <Badge.Ribbon
                    text="Featured"
                    color="purple"
                    className="featured-ribbon"
                  />
                </div>
                <div className="product-info">
                  <span className="product-category">
                    {getLoc(
                      product?.subcatalog?.catalog,
                      "name",
                      i18n.language,
                    )}{" "}
                    / {getLoc(product?.subcatalog, "name", i18n.language)}
                  </span>
                  <h3 className="product-name">
                    {getLoc(product, "name", i18n.language)}
                  </h3>
                  <div className="product-price">
                    <span className="current-price">
                      {formatPrice(product.price)}
                    </span>
                    {product.old_price && (
                      <span className="old-price">
                        {formatPrice(product.old_price)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
      </div>
    </section>
  );
}
