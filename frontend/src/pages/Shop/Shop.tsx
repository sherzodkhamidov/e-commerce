import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CloseOutlined } from "@ant-design/icons";
import { Button, Pagination, Empty, Skeleton } from "antd";
import api from "../../api/axios";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";

import type { Catalog, PaginatedProducts, Subcatalog } from "./types";
import ProductCard from "./components/ProductCard";
import ShopSidebar from "./components/ShopSidebar";
import ShopTopBar from "./components/ShopTopBar";
import CatalogGrid from "./components/CatalogGrid";

import "./Shop.css";

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t, i18n } = useTranslation();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [catalogs, setCatalogs] = useState<Catalog[]>([]);
  const [products, setProducts] = useState<PaginatedProducts | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [expandedCatalogs, setExpandedCatalogs] = useState<number[]>([]);

  const [localSearch, setLocalSearch] = useState(
    searchParams.get("search") || "",
  );

  const catalogId = searchParams.get("catalog") || "";
  const subcatalogId = searchParams.get("subcatalog") || "";
  const sortBy = searchParams.get("sort") || "popular"; // Default to popular
  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "1");

  const getLoc = (item: any, field: string) => {
    const lang = i18n.language === "en" ? "eng" : i18n.language;
    const key = `${field}_${lang}`;
    return item[key] || item[field] || "";
  };

  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== search) {
        updateFilter("search", localSearch);
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [localSearch]);

  useEffect(() => {
    fetchCatalogsWithSubcatalogs();
  }, [i18n.language]);

  useEffect(() => {
    fetchProducts();
  }, [catalogId, subcatalogId, sortBy, search, page, i18n.language]);

  useEffect(() => {
    if (catalogId) {
      const catNum = parseInt(catalogId);
      if (!expandedCatalogs.includes(catNum)) {
        setExpandedCatalogs([...expandedCatalogs, catNum]);
      }
    }
  }, [catalogId]);

  const fetchCatalogsWithSubcatalogs = async () => {
    try {
      const [catalogsRes, subcatalogsRes] = await Promise.all([
        api.get("/catalogs"),
        api.get("/subcatalogs"),
      ]);
      const subcatalogsData = subcatalogsRes.data.data || [];
      const catalogsData = catalogsRes.data.data || [];

      const subcatalogsByCatalog = subcatalogsData.reduce(
        (acc: Record<number, Subcatalog[]>, sub: Subcatalog) => {
          if (!acc[sub.catalog_id]) acc[sub.catalog_id] = [];
          acc[sub.catalog_id].push(sub);
          return acc;
        },
        {},
      );

      const catalogsWithSubs = catalogsData.map((cat: Catalog) => ({
        ...cat,
        subcatalogs: subcatalogsByCatalog[cat.id] || [],
      }));

      setCatalogs(catalogsWithSubs);
    } catch (error) {
      console.error("Error fetching catalogs:", error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) {
        params.append("search", search);
      } else {
        if (catalogId) params.append("catalog_id", catalogId);
        if (subcatalogId) params.append("subcatalog_id", subcatalogId);
      }
      params.append("page", page.toString());
      params.append("per_page", "12");

      if (sortBy === "price_asc") params.append("sort", "price_asc");
      else if (sortBy === "price_desc") params.append("sort", "price_desc");
      else if (sortBy === "name_asc") {
        params.append("sort", "name");
        params.append("order", "asc");
      } else if (sortBy === "name_desc") {
        params.append("sort", "name");
        params.append("order", "desc");
      }
      // Handle 'popular', 'newest', 'rating' sorting logic here if supported by API
      // For now, default fallback or specific params if they exist

      const response = await api.get(`/products?${params.toString()}`);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) newParams.set(key, value);
    else newParams.delete(key);

    if (key !== "page") newParams.delete("page");
    if (key === "catalog") newParams.delete("subcatalog");
    if (key === "search" && value) {
      newParams.delete("catalog");
      newParams.delete("subcatalog");
    }
    setSearchParams(newParams);
  };

  const selectCategory = (catId: string, subId: string = "") => {
    const newParams = new URLSearchParams(searchParams);
    if (catId) newParams.set("catalog", catId);
    else newParams.delete("catalog");

    if (subId) newParams.set("subcatalog", subId);
    else newParams.delete("subcatalog");

    newParams.delete("page");
    newParams.delete("search");
    setSearchParams(newParams);
    setLocalSearch("");
    window.scrollTo({ top: 0, behavior: "smooth" });
    setIsCatalogOpen(false);
  };

  const handleToggleWishlist = async (productId: number) => {
    if (!isAuthenticated) return alert(t("product.pleaseLogin"));
    setActionLoading(productId);
    try {
      await toggleWishlist(productId);
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(null);
    }
  };

  const handleAddToCart = async (productId: number) => {
    if (!isAuthenticated) return alert("Please login to add items to cart");
    setActionLoading(productId);
    try {
      await addToCart(productId);
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <>
      {/* Full Page Catalog Overlay */}
      {isCatalogOpen && (
        <div className="catalog-overlay">
          <div className="catalog-overlay-header">
            <h2>{t("common.categories") || "Catalogs"}</h2>
            <Button
              type="text"
              icon={<CloseOutlined style={{ fontSize: 24 }} />}
              onClick={() => setIsCatalogOpen(false)}
            />
          </div>
          <div className="catalog-overlay-content">
            <CatalogGrid
              catalogs={catalogs}
              selectCategory={selectCategory}
              getLoc={getLoc}
            />
          </div>
        </div>
      )}

      <div className="shop-container">
        {/* Top Bar Layout */}
        <div style={{ width: "100%" }}>
          <ShopTopBar
            localSearch={localSearch}
            setLocalSearch={setLocalSearch}
            isCatalogOpen={isCatalogOpen}
            setIsCatalogOpen={setIsCatalogOpen}
            setSidebarOpen={setSidebarOpen}
          />

          {/* Breadcrumbs below Top Bar */}
          <div className="shop-breadcrumbs">
            <Link to="/" className="breadcrumb-link">
              {t("common.home")}
            </Link>
            <span className="breadcrumb-separator">/</span>
            <Link
              to="/shop"
              className={`breadcrumb-link ${!catalogId && !subcatalogId ? "breadcrumb-current" : ""}`}
              onClick={() => selectCategory("")}
            >
              {t("common.shop")}
            </Link>
            {catalogId && (
              <>
                <span className="breadcrumb-separator">/</span>
                <button
                  className={`breadcrumb-link ${!subcatalogId ? "breadcrumb-current" : ""}`}
                  onClick={() => selectCategory(catalogId)}
                >
                  {getLoc(
                    catalogs.find((c) => c.id.toString() === catalogId) || {},
                    "name",
                  )}
                </button>
              </>
            )}
            {subcatalogId && (
              <>
                <span className="breadcrumb-separator">/</span>
                <span className="breadcrumb-current">
                  {getLoc(
                    catalogs
                      .find((c) => c.id.toString() === catalogId)
                      ?.subcatalogs?.find(
                        (s) => s.id.toString() === subcatalogId,
                      ) || {},
                    "name",
                  )}
                </span>
              </>
            )}
          </div>
        </div>

        <div
          className="shop-content-wrapper"
          style={{ display: "flex", gap: "32px", width: "100%" }}
        >
          {/* Sidebar on the Left */}
          <ShopSidebar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            sortBy={sortBy}
            updateFilter={updateFilter}
          />

          {/* Main Product Area on the Right */}
          <main className="shop-main">
            {/* Active Filters Display could go here */}

            {loading ? (
              <div className="products-grid">
                {Array.from({ length: 12 }).map((_, index) => (
                  <div key={index} className="product-card skeleton-card">
                    <div className="product-image-wrapper">
                      <Skeleton.Image active className="skeleton-image" />
                    </div>
                    <div className="product-info">
                      <Skeleton.Input
                        active
                        size="small"
                        className="skeleton-category"
                        style={{ width: "60%", marginBottom: 6 }}
                      />
                      <Skeleton.Input
                        active
                        size="small"
                        className="skeleton-description"
                        style={{ width: "100%", marginBottom: 12 }}
                      />
                      <div className="product-price">
                        <Skeleton.Button
                          active
                          size="default"
                          shape="round"
                          className="skeleton-price"
                          style={{ width: 80 }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : products && products.data.length > 0 ? (
              <>
                <div className="products-grid">
                  {products.data.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      getLoc={getLoc}
                      isInWishlist={isInWishlist}
                      toggleWishlist={handleToggleWishlist}
                      addToCart={handleAddToCart}
                      actionLoading={actionLoading}
                    />
                  ))}
                </div>
                <div className="pagination-wrapper">
                  <Pagination
                    current={page}
                    total={products.total}
                    pageSize={12}
                    onChange={(p) => updateFilter("page", p.toString())}
                    showSizeChanger={false}
                  />
                </div>
              </>
            ) : (
              <Empty
                description={t("shop.noProducts")}
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                className="shop-empty"
              >
                <Button type="primary" onClick={() => selectCategory("")}>
                  {t("shop.resetFilters")}
                </Button>
              </Empty>
            )}
          </main>
        </div>
      </div>
    </>
  );
}
