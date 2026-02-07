import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Skeleton } from "antd";
import { ArrowRightOutlined, AppstoreOutlined } from "@ant-design/icons";
import { ProgressiveImage } from "../../../../components/ProgressiveImage";
import { getLoc, type Catalog } from "../../types";
import "./CategoriesSection.css";

interface CategoriesSectionProps {
  catalogs: Catalog[];
  loading?: boolean;
}

export default function CategoriesSection({
  catalogs,
  loading = false,
}: CategoriesSectionProps) {
  const { t, i18n } = useTranslation();

  const skeletonCards = Array.from({ length: 4 }, (_, index) => (
    <div key={index} className="category-card skeleton-card">
      <div className="category-image">
        <Skeleton.Image active className="skeleton-image" />
      </div>
      <div className="category-info">
        <Skeleton.Input active size="small" className="skeleton-title" />
      </div>
    </div>
  ));

  return (
    <section className="categories-section page-container">
      <div className="section-header">
        <h2>{t("home.browseCategories")}</h2>
        <Link to="/shop" className="view-all-link">
          {t("home.viewAll")}
          <ArrowRightOutlined />
        </Link>
      </div>
      <div className="categories-grid">
        {loading
          ? skeletonCards
          : catalogs.slice(0, 4).map((catalog) => (
              <Link
                to={`/shop?catalog=${catalog.id}`}
                key={catalog.id}
                className="category-card"
              >
                <div className="category-image">
                  {catalog.image ? (
                    <ProgressiveImage
                      src={catalog.image}
                      alt={getLoc(catalog, "name", i18n.language)}
                    />
                  ) : (
                    <div className="category-placeholder">
                      <AppstoreOutlined className="placeholder-icon" />
                    </div>
                  )}
                  <div className="category-overlay"></div>
                </div>
                <div className="category-info">
                  <h3>{getLoc(catalog, "name", i18n.language)}</h3>
                </div>
              </Link>
            ))}
      </div>
    </section>
  );
}
