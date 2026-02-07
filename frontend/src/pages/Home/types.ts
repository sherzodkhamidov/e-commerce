export interface Catalog {
  id: number;
  name: string;
  name_uz: string;
  name_ru: string;
  name_eng: string;
  slug: string;
  description: string | null;
  description_uz: string | null;
  description_ru: string | null;
  description_eng: string | null;
  image: string | null;
  subcatalogs_count: number;
}

export interface Subcatalog {
  id: number;
  name: string;
  name_uz: string;
  name_ru: string;
  name_eng: string;
  slug: string;
  catalog?: {
    name: string;
    name_uz: string;
    name_ru: string;
    name_eng: string;
  };
}

export interface Product {
  id: number;
  name: string;
  name_uz: string;
  name_ru: string;
  name_eng: string;
  slug: string;
  short_description: string | null;
  short_description_uz: string | null;
  short_description_ru: string | null;
  short_description_eng: string | null;
  price: string;
  old_price: string | null;
  image: string | null;
  subcatalog: Subcatalog;
}

// Helper to get localized value
export const getLoc = (item: any, field: string, language: string): string => {
  if (!item) return "";
  const lang = language === "en" ? "eng" : language;
  const key = `${field}_${lang}`;
  return item[key] || item[field] || "";
};

export const formatPrice = (price: string): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(parseFloat(price));
};

export const getDiscountPercentage = (
  price: string,
  oldPrice: string,
): number => {
  const p = parseFloat(price);
  const op = parseFloat(oldPrice);
  return Math.round(((op - p) / op) * 100);
};
