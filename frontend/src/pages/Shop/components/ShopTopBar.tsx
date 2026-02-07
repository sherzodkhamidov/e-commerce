import { useTranslation } from "react-i18next";
import { Input, Button } from "antd";
import {
  SearchOutlined,
  AppstoreOutlined,
  FilterOutlined,
} from "@ant-design/icons";

interface ShopTopBarProps {
  localSearch: string;
  setLocalSearch: (value: string) => void;
  isCatalogOpen: boolean;
  setIsCatalogOpen: (open: boolean) => void;
  setSidebarOpen: (open: boolean) => void;
}

export default function ShopTopBar({
  localSearch,
  setLocalSearch,
  isCatalogOpen,
  setIsCatalogOpen,
  setSidebarOpen,
}: ShopTopBarProps) {
  const { t } = useTranslation();

  return (
    <div className="shop-top-bar">
      <div className="catalog-wrapper">
        <Button
          type={isCatalogOpen ? "primary" : "default"}
          size="large"
          icon={<AppstoreOutlined />}
          onClick={() => setIsCatalogOpen(!isCatalogOpen)}
          className="catalog-btn"
        >
          {t("common.categories") || "Catalogs"}
        </Button>
      </div>

      <div className="search-wrapper-row">
        <Input
          size="large"
          placeholder={t("shop.searchPlaceholder") || "Search products..."}
          prefix={<SearchOutlined style={{ color: "var(--text-muted)" }} />}
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="search-bar-input"
          allowClear
        />
        <button
          className="mobile-filter-icon-btn"
          onClick={() => setSidebarOpen(true)}
        >
          <FilterOutlined />
        </button>
      </div>
    </div>
  );
}
