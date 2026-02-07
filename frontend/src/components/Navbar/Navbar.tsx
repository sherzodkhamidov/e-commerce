import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import UzbFlag from "../../assets/flags/uzbekistan.png";
import RuFlag from "../../assets/flags/russia.png";
import EnFlag from "../../assets/flags/english.png";
import {
  Layout,
  Menu,
  Button,
  Dropdown,
  Avatar,
  Badge,
  Space,
  Grid,
  Drawer,
} from "antd";
import {
  ShoppingCartOutlined,
  HeartOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuOutlined,
  ShoppingOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import "./Navbar.css";

const { Header } = Layout;
const { useBreakpoint } = Grid;

interface NavbarProps {
  onLogoutClick: () => void;
}

export default function Navbar({ onLogoutClick }: NavbarProps) {
  const { t, i18n } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const { itemsCount } = useCart();
  const { wishlistIds } = useWishlist();
  const location = useLocation();
  const screens = useBreakpoint();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getSelectedKey = () => {
    if (location.pathname === "/") return "/";
    if (
      location.pathname === "/shop" ||
      location.pathname.startsWith("/product")
    )
      return "/shop";
    return location.pathname;
  };

  const changeLanguage = ({ key }: { key: string }) => {
    i18n.changeLanguage(key);
  };

  const getLanguageFlag = () => {
    switch (i18n.language) {
      case "en":
        return EnFlag;
      case "ru":
        return RuFlag;
      case "uz":
        return UzbFlag;
      default:
        return EnFlag;
    }
  };

  const languageItems: MenuProps["items"] = [
    {
      key: "en",
      label: "EN",
      icon: <img src={EnFlag} alt="EN" className="flag-icon" />,
    },
    {
      key: "ru",
      label: "RU",
      icon: <img src={RuFlag} alt="RU" className="flag-icon" />,
    },
    {
      key: "uz",
      label: "UZ",
      icon: <img src={UzbFlag} alt="UZ" className="flag-icon" />,
    },
  ];

  const userMenuItems: MenuProps["items"] = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: <Link to="/profile">{t("common.profile")}</Link>,
    },
    {
      key: "orders",
      icon: <FileTextOutlined />,
      label: <Link to="/orders">{t("common.myOrders")}</Link>,
    },
    {
      key: "wishlist",
      icon: <HeartOutlined />,
      label: (
        <Link to="/wishlist" className="navbar-dropdown-link">
          {t("common.wishlist")}
          {wishlistIds.length > 0 && (
            <Badge count={wishlistIds.length} size="small" />
          )}
        </Link>
      ),
    },
    {
      key: "cart",
      icon: <ShoppingCartOutlined />,
      label: (
        <Link to="/cart" className="navbar-dropdown-link">
          {t("common.myCart")}
          {itemsCount > 0 && <Badge count={itemsCount} size="small" />}
        </Link>
      ),
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: t("common.signOut"),
      danger: true,
      onClick: onLogoutClick,
    },
  ];

  const mainNavItems: MenuProps["items"] = [
    {
      key: "/",
      label: <Link to="/">{t("common.home")}</Link>,
    },
    {
      key: "/shop",
      label: <Link to="/shop">{t("common.shop")}</Link>,
    },
  ];

  return (
    <Header
      className="navbar-header page-container"
      style={{ background: "var(--bg-card)" }}
    >
      <div className="navbar-left">
        {/* Mobile Menu Trigger - Hidden on mobile via CSS */}
        {!screens.md && (
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={() => setMobileMenuOpen(true)}
            className="navbar-mobile-menu-btn"
          />
        )}

        {/* Brand */}
        <Link
          to="/"
          className="navbar-brand"
          style={{ color: "var(--text-primary)" }}
        >
          <ShoppingOutlined
            className="navbar-brand-icon"
            style={{ color: "var(--accent-primary)" }}
          />
          <span>Alvon</span>
        </Link>
      </div>
      {/* Desktop Navigation */}
      {screens.md && (
        <Menu
          mode="horizontal"
          selectedKeys={[getSelectedKey()]}
          items={mainNavItems}
          className="navbar-desktop-menu"
        />
      )}

      {/* Right Actions */}
      <div className="navbar-right">
        <Dropdown menu={{ items: languageItems, onClick: changeLanguage }}>
          <Button
            type="text"
            icon={
              <img
                src={getLanguageFlag()}
                alt={i18n.language}
                className="flag-icon"
              />
            }
          >
            {i18n.language.toUpperCase()}
          </Button>
        </Dropdown>

        {isAuthenticated ? (
          <Dropdown
            menu={{ items: userMenuItems }}
            trigger={["click"]}
            placement="bottomRight"
          >
            <Space className="navbar-user-trigger">
              <Avatar
                style={{
                  backgroundColor: "var(--accent-primary)",
                  color: "#fff",
                }}
                icon={<UserOutlined />}
              >
                {user?.name?.charAt(0).toUpperCase()}
              </Avatar>
              {screens.md && (
                <span style={{ color: "var(--text-primary)" }}>
                  {user?.name}
                </span>
              )}
            </Space>
          </Dropdown>
        ) : screens.md ? (
          <Space>
            <Link to="/login">
              <Button type="text">{t("common.signIn")}</Button>
            </Link>
            <Link to="/register">
              <Button type="primary">{t("common.signUp")}</Button>
            </Link>
          </Space>
        ) : (
          <Link to="/login">
            <Button type="primary" size="small">
              {t("common.signIn")}
            </Button>
          </Link>
        )}
      </div>

      {/* Mobile Menu Drawer */}
      <Drawer
        title="Menu"
        placement="left"
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        styles={{ body: { padding: 0 } }}
      >
        <Menu
          mode="inline"
          selectedKeys={[getSelectedKey()]}
          items={mainNavItems}
          onClick={() => setMobileMenuOpen(false)}
          className="navbar-drawer-menu"
        />
        {!isAuthenticated && (
          <div className="navbar-drawer-footer">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="navbar-drawer-auth-link"
            >
              <Button block>{t("common.signIn")}</Button>
            </Link>
            <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
              <Button type="primary" block>
                {t("common.signUp")}
              </Button>
            </Link>
          </div>
        )}
      </Drawer>
    </Header>
  );
}
