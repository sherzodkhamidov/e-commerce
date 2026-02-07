import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import "./MobileShopPage.css";
import { useTranslation } from "react-i18next";

interface Subcatalog {
  id: number;
  name: string;
  name_uz?: string;
  name_ru?: string;
  name_eng?: string;
  slug: string;
  catalog_id: number;
}

interface Catalog {
  id: number;
  name: string;
  name_uz?: string;
  name_ru?: string;
  name_eng?: string;
  slug: string;
  image: string | null;
  subcatalogs?: Subcatalog[];
}

export default function MobileShopPage() {
  const navigate = useNavigate();
  const [catalogs, setCatalogs] = useState<Catalog[]>([]);
  const [selectedCatalog, setSelectedCatalog] = useState<Catalog | null>(null);
  const [loading, setLoading] = useState(false);
  const { i18n } = useTranslation();

  // Helper to get localized value
  const getLoc = (item: any, field: string) => {
    const lang = i18n.language === "en" ? "eng" : i18n.language;
    const key = `${field}_${lang}`;
    return item[key] || item[field] || "";
  };

  useEffect(() => {
    fetchCatalogs();
  }, []);

  const fetchCatalogs = async () => {
    setLoading(true);
    try {
      const [catalogsRes, subcatalogsRes] = await Promise.all([
        api.get("/catalogs"),
        api.get("/subcatalogs"),
      ]);

      const subcatalogsData = subcatalogsRes.data.data || [];
      const catalogsData = catalogsRes.data.data || [];

      const subcatalogsByCatalog = subcatalogsData.reduce(
        (acc: Record<number, Subcatalog[]>, sub: Subcatalog) => {
          if (!acc[sub.catalog_id]) {
            acc[sub.catalog_id] = [];
          }
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
    } finally {
      setLoading(false);
    }
  };

  const handleCatalogSelect = (catalog: Catalog) => {
    if (catalog.subcatalogs && catalog.subcatalogs.length > 0) {
      setSelectedCatalog(catalog);
    } else {
      // If no subcatalogs, go directly to shop with catalog filter
      navigate(`/shop?catalog=${catalog.id}`);
    }
  };

  const handleSubcatalogSelect = (subcatalogId: number) => {
    navigate(`/shop?catalog=${selectedCatalog?.id}&subcatalog=${subcatalogId}`);
  };

  const handleBack = () => {
    setSelectedCatalog(null);
  };

  return (
    <div className="mobile-shop-page">
      <div className="mobile-shop-page-content">
        {loading ? (
          <div className="mobile-shop-page-loading">
            {selectedCatalog
              ? // Subcatalogs skeleton
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="mobile-shop-page-skeleton-item">
                    <div className="skeleton skeleton-text"></div>
                    <div className="skeleton skeleton-icon"></div>
                  </div>
                ))
              : // Catalogs skeleton
                Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="mobile-shop-page-skeleton-item">
                    <div className="skeleton skeleton-text"></div>
                    <div className="skeleton skeleton-icon"></div>
                  </div>
                ))}
          </div>
        ) : (
          <>
            {!selectedCatalog ? (
              <div className="mobile-shop-page-catalogs">
                {catalogs.length > 0 ? (
                  catalogs.map((catalog) => (
                    <button
                      key={catalog.id}
                      className="mobile-shop-page-item"
                      onClick={() => handleCatalogSelect(catalog)}
                    >
                      <div className="mobile-shop-page-item-content">
                        {catalog.image && (
                          <img
                            src={catalog.image}
                            alt={getLoc(catalog, "name")}
                            className="mobile-shop-page-item-image"
                            loading="lazy"
                          />
                        )}
                        <span>{getLoc(catalog, "name")}</span>
                      </div>
                      {catalog.subcatalogs &&
                        catalog.subcatalogs.length > 0 && (
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M9 18L15 12L9 6"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                    </button>
                  ))
                ) : (
                  <div className="mobile-shop-page-empty">
                    <p>No categories available</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="mobile-shop-page-subcatalogs">
                {/* Add a back button item since header is gone */}
                <button
                  className="mobile-shop-page-item back-item"
                  onClick={handleBack}
                >
                  <div className="mobile-shop-page-item-content">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ marginRight: 8, width: 20, height: 20 }}
                    >
                      <path
                        d="M19 12H5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 19L5 12L12 5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>{getLoc(selectedCatalog, "name")}</span>
                  </div>
                </button>

                {selectedCatalog.subcatalogs &&
                selectedCatalog.subcatalogs.length > 0 ? (
                  selectedCatalog.subcatalogs.map((subcatalog) => (
                    <button
                      key={subcatalog.id}
                      className="mobile-shop-page-item"
                      onClick={() => handleSubcatalogSelect(subcatalog.id)}
                    >
                      <div className="mobile-shop-page-item-content">
                        <span>{getLoc(subcatalog, "name")}</span>
                      </div>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9 18L15 12L9 6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  ))
                ) : (
                  <div className="mobile-shop-page-empty">
                    <p>No subcategories available</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
