import { useTranslation } from "react-i18next";
import { Modal, Radio, Space } from "antd";

interface ShopSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  sortBy: string;
  updateFilter: (key: string, value: string) => void;
}

export default function ShopSidebar({
  sidebarOpen,
  setSidebarOpen,
  sortBy,
  updateFilter,
}: ShopSidebarProps) {
  const { t } = useTranslation();

  const handleSortChange = (e: any) => {
    updateFilter("sort", e.target.value);
    setSidebarOpen(false); // Close modal on selection if desired, or let user close manually
  };

  const sortOptions = (
    <Radio.Group onChange={handleSortChange} value={sortBy}>
      <Space direction="vertical">
        <Radio value="popular">{t("shop.popular") || "Popular"}</Radio>
        <Radio value="newest">{t("shop.new") || "New"}</Radio>
        <Radio value="price_asc">
          {t("shop.priceLowHigh") || "Price: Low to High"}
        </Radio>
        <Radio value="price_desc">
          {t("shop.priceHighLow") || "Price: High to Low"}
        </Radio>
        <Radio value="rating">{t("shop.rating") || "Rating"}</Radio>
      </Space>
    </Radio.Group>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="shop-sidebar desktop-only">
        <div className="sidebar-header">
          <h2>{t("shop.sortBy") || "Sort By"}</h2>
        </div>
        <div className="sidebar-content">
          <div className="filter-section">{sortOptions}</div>
        </div>
      </aside>

      {/* Mobile Modal */}
      <Modal
        title={t("shop.sortBy") || "Sort By"}
        open={sidebarOpen}
        onCancel={() => setSidebarOpen(false)}
        footer={null}
        centered
        width={300}
        className="sort-modal"
      >
        <div style={{ padding: "12px 0" }}>{sortOptions}</div>
      </Modal>
    </>
  );
}
