export type Subcatalog = {
  id: number;
  name: string;
  name_uz?: string;
  name_ru?: string;
  name_eng?: string;
  slug: string;
  catalog_id: number;
};

export type Catalog = {
  id: number;
  name: string;
  name_uz?: string;
  name_ru?: string;
  name_eng?: string;
  slug: string;
  image: string | null;
  subcatalogs?: Subcatalog[];
};

export type ProductSubcatalog = Subcatalog & {
  catalog?: {
    id: number;
    name: string;
    name_uz?: string;
    name_ru?: string;
    name_eng?: string;
    slug: string;
  };
};

export type Product = {
  id: number;
  name: string;
  name_uz?: string;
  name_ru?: string;
  name_eng?: string;
  slug: string;
  short_description: string | null;
  price: string;
  old_price: string | null;
  image: string | null;
  stock: number;
  is_featured: boolean;
  subcatalog: ProductSubcatalog;
};

export type PaginatedProducts = {
  data: Product[];
  current_page: number;
  last_page: number;
  total: number;
};
