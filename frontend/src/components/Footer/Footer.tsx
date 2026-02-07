import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ShoppingOutlined } from "@ant-design/icons";
import "./Footer.css";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="main-footer page-container">
      <div className="footer-content">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <ShoppingOutlined className="footer-logo-icon" />
            <span>Alvon</span>
          </Link>
          <p>{t("footer.tagline")}</p>
        </div>
        <div className="footer-links">
          <div className="footer-column">
            <h4>{t("footer.shop")}</h4>
            <Link to="/shop">{t("footer.allProducts")}</Link>
            <Link to="/shop?sort=newest">{t("footer.newArrivals")}</Link>
            <Link to="/shop?featured=1">{t("footer.featured")}</Link>
          </div>
          <div className="footer-column">
            <h4>{t("footer.account")}</h4>
            <Link to="/profile">{t("footer.myProfile")}</Link>
            <Link to="/orders">{t("footer.myOrders")}</Link>
            <Link to="/wishlist">{t("footer.wishlist")}</Link>
            <Link to="/cart">{t("footer.shoppingCart")}</Link>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>
          &copy; {new Date().getFullYear()} Alvon. {t("footer.rights")}
        </p>
      </div>
    </footer>
  );
}
