import type { Catalog } from "../types";

interface CatalogGridProps {
  catalogs: Catalog[];
  selectCategory: (catId: string, subId?: string) => void;
  getLoc: (item: any, field: string) => string;
}

export default function CatalogGrid({
  catalogs,
  selectCategory,
  getLoc,
}: CatalogGridProps) {
  return (
    <div className="catalog-full-page">
      <div className="catalog-grid">
        {catalogs.map((catalog) => (
          <div key={catalog.id} className="catalog-card">
            <button
              className="catalog-card-header"
              onClick={() => selectCategory(catalog.id.toString())}
            >
              {catalog.image && (
                <img
                  src={catalog.image}
                  alt={getLoc(catalog, "name")}
                  className="catalog-card-image"
                />
              )}
              <span className="catalog-card-title">
                {getLoc(catalog, "name")}
              </span>
            </button>
            <div className="catalog-card-subs">
              {catalog.subcatalogs?.map((sub) => (
                <button
                  key={sub.id}
                  className="catalog-sub-link"
                  onClick={() =>
                    selectCategory(catalog.id.toString(), sub.id.toString())
                  }
                >
                  {getLoc(sub, "name")}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
