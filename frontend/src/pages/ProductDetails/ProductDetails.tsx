import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { message } from "antd";
import {
  ArrowLeftOutlined,
  ShoppingCartOutlined,
  HeartOutlined,
  HeartFilled,
  PictureOutlined,
  MinusOutlined,
  PlusOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import api from "../../api/axios";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";
import "./ProductDetails.css";

interface Catalog {
  id: number;
  name: string;
  name_uz?: string;
  name_ru?: string;
  name_eng?: string;
  slug: string;
}

interface Subcatalog {
  id: number;
  name: string;
  name_uz?: string;
  name_ru?: string;
  name_eng?: string;
  slug: string;
  catalog: Catalog;
}

interface Product {
  id: number;
  name: string;
  name_uz?: string;
  name_ru?: string;
  name_eng?: string;
  slug: string;
  description: string | null;
  description_uz?: string | null;
  description_ru?: string | null;
  description_eng?: string | null;
  short_description: string | null;
  short_description_uz?: string | null;
  short_description_ru?: string | null;
  short_description_eng?: string | null;
  price: string;
  old_price: string | null;
  sku: string | null;
  stock: number;
  image: string | null;
  gallery: string[] | null;
  is_featured: boolean;
  subcatalog: Subcatalog;
}

export default function ProductDetails() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [togglingWishlist, setTogglingWishlist] = useState(false);

  // Helper to get localized value
  const getLoc = (item: any, field: string) => {
    const lang = i18n.language === "en" ? "eng" : i18n.language;
    const key = `${field}_${lang}`;
    return item[key] || item[field] || "";
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(parseFloat(price));
  };

  const getDiscountPercentage = (price: string, oldPrice: string) => {
    const p = parseFloat(price);
    const old = parseFloat(oldPrice);
    if (!old || old <= p) return 0;
    return Math.round(((old - p) / old) * 100);
  };

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/products/${slug}`);
      const data = response.data;
      const productData = data.product;

      if (!productData) {
        setProduct(null);
        return;
      }

      setProduct(productData);

      if (productData.image) {
        setSelectedImage(productData.image);
      }

      // Set related products from response or fetch if missing
      if (data.related_products) {
        setRelatedProducts(data.related_products);
      } else if (productData.subcatalog?.id) {
        const relatedRes = await api.get(
          `/products?subcatalog=${productData.subcatalog.id}`,
        );
        const related = (relatedRes.data.data || [])
          .filter((p: Product) => p.id !== productData.id)
          .slice(0, 4);
        setRelatedProducts(related);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  const allImages = product
    ? ([product.image, ...(product.gallery || [])].filter(Boolean) as string[])
    : [];

  useEffect(() => {
    fetchProduct();
    setQuantity(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, i18n.language]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      message.warning("Please login to add items to cart");
      return;
    }
    if (!product) return;

    setAddingToCart(true);
    try {
      await addToCart(product.id, quantity);
    } catch (error) {
    } finally {
      setAddingToCart(false);
    }
  };

  const handleToggleWishlist = async () => {
    if (!isAuthenticated) {
      message.warning("Please login to add items to wishlist");
      return;
    }
    if (!product) return;

    setTogglingWishlist(true);
    try {
      await toggleWishlist(product.id);
    } catch (error) {
    } finally {
      setTogglingWishlist(false);
    }
  };

  if (loading) {
    return (
      <div className="product-detail-container">
        <div
          className="back-nav skeleton skeleton-text"
          style={{ width: "100px" }}
        ></div>
        <div className="product-detail-content">
          <div className="product-gallery">
            <div
              className="main-image skeleton"
              style={{ height: "500px" }}
            ></div>
            <div className="thumbnail-list">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="thumbnail skeleton"
                  style={{ width: "80px", height: "80px" }}
                ></div>
              ))}
            </div>
          </div>
          <div className="product-info-column">
            <div
              className="skeleton skeleton-text title"
              style={{ width: "80%", height: "40px", marginBottom: "20px" }}
            ></div>
            <div
              className="skeleton skeleton-text"
              style={{ width: "100px", height: "30px", marginBottom: "20px" }}
            ></div>
            <div
              className="skeleton skeleton-text"
              style={{ width: "100%", height: "100px" }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-container">
        <div className="not-found-state">
          <h2>Product Not Found</h2>
          <p>
            The product you are looking for does not exist or has been removed.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="primary-btn-link"
            style={{ border: "none", cursor: "pointer" }}
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail-container">
      {/* Back Navigation */}
      {/* Back Navigation */}
      <button
        onClick={() => navigate(-1)}
        className="back-nav"
        style={{
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          background: "transparent",
          border: "none",
          padding: 0,
          fontFamily: "inherit",
          fontSize: "inherit",
          color: "inherit",
        }}
      >
        <ArrowLeftOutlined />
        Back
      </button>

      {/* Breadcrumb */}
      <nav className="breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/shop">Shop</Link>
        <span>/</span>
        <Link to={`/shop?catalog=${product.subcatalog.catalog.id}`}>
          {getLoc(product.subcatalog.catalog, "name")}
        </Link>
        <span>/</span>
        <Link to={`/shop?subcatalog=${product.subcatalog.id}`}>
          {getLoc(product.subcatalog, "name")}
        </Link>
        <span>/</span>
        <span className="current">{getLoc(product, "name")}</span>
      </nav>

      <div className="product-detail-content">
        {/* Image Gallery */}
        <div className="product-gallery">
          <div className="main-image">
            {selectedImage ? (
              <img src={selectedImage} alt={getLoc(product, "name")} />
            ) : (
              <div className="no-image-large">
                <PictureOutlined
                  style={{ fontSize: 64, color: "var(--text-muted)" }}
                />
              </div>
            )}
            {product.old_price && (
              <span className="discount-badge large">
                -{getDiscountPercentage(product.price, product.old_price)}%
              </span>
            )}
          </div>
          {allImages.length > 1 && (
            <div className="thumbnail-gallery">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  className={`thumbnail ${selectedImage === img ? "active" : ""}`}
                  onClick={() => setSelectedImage(img)}
                >
                  <img
                    src={img}
                    alt={`${getLoc(product, "name")} ${idx + 1}`}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="product-info-detail">
          <div className="product-badges">
            {product.is_featured && (
              <span className="badge featured">Featured</span>
            )}
            {product.stock > 0 ? (
              <span className="badge in-stock">In Stock ({product.stock})</span>
            ) : (
              <span className="badge out-of-stock">Out of Stock</span>
            )}
          </div>

          <h1 className="product-title">{getLoc(product, "name")}</h1>

          {product.sku && <p className="product-sku">SKU: {product.sku}</p>}

          <div className="product-price-detail">
            <span className="current-price">{formatPrice(product.price)}</span>
            {product.old_price && (
              <>
                <span className="old-price">
                  {formatPrice(product.old_price)}
                </span>
                <span className="save-amount">
                  Save{" "}
                  {formatPrice(
                    (
                      parseFloat(product.old_price) - parseFloat(product.price)
                    ).toString(),
                  )}
                </span>
              </>
            )}
          </div>

          {(product.short_description ||
            product.short_description_uz ||
            product.short_description_ru ||
            product.short_description_eng) && (
            <p className="product-short-desc">
              {getLoc(product, "short_description")}
            </p>
          )}

          <div className="product-actions">
            <div className="quantity-selector">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <MinusOutlined />
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                }
                min="1"
                max={product.stock}
              />
              <button
                onClick={() =>
                  setQuantity(Math.min(product.stock, quantity + 1))
                }
                disabled={quantity >= product.stock}
              >
                <PlusOutlined />
              </button>
            </div>

            <button
              className="add-to-cart-btn"
              disabled={product.stock === 0 || addingToCart || !isAuthenticated}
              onClick={handleAddToCart}
            >
              {addingToCart ? (
                <LoadingOutlined spin />
              ) : (
                <ShoppingCartOutlined />
              )}
              {product.stock === 0
                ? "Out of Stock"
                : addingToCart
                  ? "Adding..."
                  : "Add to Cart"}
            </button>

            <button
              className={`wishlist-btn ${isInWishlist(product.id) ? "active" : ""}`}
              disabled={togglingWishlist || !isAuthenticated}
              onClick={handleToggleWishlist}
            >
              {isInWishlist(product.id) ? <HeartFilled /> : <HeartOutlined />}
            </button>
          </div>

          {getLoc(product, "description") && (
            <div className="product-description-full">
              <h3>Description</h3>
              <div
                dangerouslySetInnerHTML={{
                  __html: getLoc(product, "description"),
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="related-products">
          <h2>Related Products</h2>
          <div className="related-grid">
            {relatedProducts.map((relatedProduct) => (
              <Link
                to={`/product/${relatedProduct.slug}`}
                key={relatedProduct.id}
                className="product-card"
              >
                <div className="product-image-wrapper">
                  {relatedProduct.image ? (
                    <img
                      src={relatedProduct.image}
                      alt={getLoc(relatedProduct, "name")}
                    />
                  ) : (
                    <div className="no-image">
                      <PictureOutlined
                        style={{ fontSize: 32, color: "var(--text-muted)" }}
                      />
                    </div>
                  )}
                </div>
                <div className="product-info">
                  <h3 className="product-name">
                    {getLoc(relatedProduct, "name")}
                  </h3>
                  <div className="product-price">
                    <span className="current-price">
                      {formatPrice(relatedProduct.price)}
                    </span>
                    {relatedProduct.old_price && (
                      <span className="old-price">
                        {formatPrice(relatedProduct.old_price)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
