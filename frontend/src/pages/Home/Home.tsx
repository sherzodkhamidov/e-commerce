import { useState, useEffect } from "react";
import api from "../../api/axios";
import { type Catalog, type Product } from "./types";
import { HeroSection, CategoriesSection, FeaturesSection } from "./components";
import "./Home.css";

export default function Home() {
  const [catalogs, setCatalogs] = useState<Catalog[]>([]);
  const [_, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [catalogsRes, productsRes] = await Promise.all([
        api.get("/catalogs"),
        api.get("/products/featured"),
      ]);

      const catalogsData = catalogsRes.data;
      if (Array.isArray(catalogsData)) {
        setCatalogs(catalogsData);
      } else if (catalogsData && Array.isArray(catalogsData.data)) {
        setCatalogs(catalogsData.data);
      } else {
        setCatalogs([]);
      }

      const productsData = productsRes.data;
      if (Array.isArray(productsData)) {
        setFeaturedProducts(productsData);
      } else if (productsData && Array.isArray(productsData.data)) {
        setFeaturedProducts(productsData.data);
      } else {
        setFeaturedProducts([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="homepage">
      <HeroSection />
      <CategoriesSection catalogs={catalogs} loading={loading} />
      {/* <FeaturedProducts products={featuredProducts} /> */}
      <FeaturesSection />
    </div>
  );
}
