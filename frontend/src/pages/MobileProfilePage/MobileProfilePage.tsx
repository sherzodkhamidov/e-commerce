import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import {
  UserOutlined,
  ShoppingOutlined,
  BgColorsOutlined,
  GlobalOutlined,
  LogoutOutlined,
  CloseOutlined,
  CheckOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { Modal } from "antd";
import { useState, useMemo } from "react";
import "./MobileProfilePage.css";
import UzbFlag from "../../assets/flags/uzbekistan.png";
import RuFlag from "../../assets/flags/russia.png";
import EnFlag from "../../assets/flags/english.png";

export default function MobileProfilePage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setShowLangMenu(false);
  };

  const handleLogout = () => {
    setShowLogoutModal(false);
    logout();
    navigate("/");
  };

  const getCurrentLanguageName = () => {
    const lang = i18n.language;
    if (lang === "en") return t("common.english");
    if (lang === "ru") return t("common.russian");
    if (lang === "uz") return t("common.uzbek");
    return t("common.english");
  };

  const menuItems = useMemo(
    () => [
      {
        key: "profile",
        icon: <UserOutlined />,
        label: t("common.userSettings"),
        onClick: () => navigate("/profile"),
      },
      {
        key: "orders",
        icon: <ShoppingOutlined />,
        label: t("common.myOrders"),
        onClick: () => navigate("/orders"),
      },
      {
        key: "theme",
        icon: <BgColorsOutlined />,
        label: `${t("common.changeColor")} (${theme === "dark" ? t("common.light") : t("common.dark")})`,
        onClick: toggleTheme,
      },
      {
        key: "language",
        icon: <GlobalOutlined />,
        label: t("common.language"),
        onClick: () => setShowLangMenu(!showLangMenu),
        extra: (
          <div className="menu-item-extra">
            <span className="current-lang">{getCurrentLanguageName()}</span>
            <RightOutlined
              className={`arrow-icon ${showLangMenu ? "rotated" : ""}`}
            />
          </div>
        ),
      },
    ],
    [t, navigate, theme, toggleTheme, showLangMenu, getCurrentLanguageName],
  );

  return (
    <div className="mobile-profile-page">
      <div className="mobile-profile-content">
        {menuItems.map((item: any) => (
          <div key={item.key} className="menu-item-wrapper">
            <button className="menu-item" onClick={item.onClick}>
              <div className="menu-item-left">
                <span className="menu-icon">{item.icon}</span>
                <span className="menu-label">{item.label}</span>
              </div>
              {item.extra}
            </button>

            {item.key === "language" && showLangMenu && (
              <div className="lang-submenu">
                <button
                  className={`lang-option ${i18n.language === "en" ? "active" : ""}`}
                  onClick={() => changeLanguage("en")}
                >
                  <div className="lang-option-content">
                    <img src={EnFlag} alt="EN" className="lang-flag" />
                    <span>{t("common.english")}</span>
                  </div>
                  {i18n.language === "en" && <CheckOutlined />}
                </button>
                <button
                  className={`lang-option ${i18n.language === "ru" ? "active" : ""}`}
                  onClick={() => changeLanguage("ru")}
                >
                  <div className="lang-option-content">
                    <img src={RuFlag} alt="RU" className="lang-flag" />
                    <span>{t("common.russian")}</span>
                  </div>
                  {i18n.language === "ru" && <CheckOutlined />}
                </button>
                <button
                  className={`lang-option ${i18n.language === "uz" ? "active" : ""}`}
                  onClick={() => changeLanguage("uz")}
                >
                  <div className="lang-option-content">
                    <img src={UzbFlag} alt="UZ" className="lang-flag" />
                    <span>{t("common.uzbek")}</span>
                  </div>
                  {i18n.language === "uz" && <CheckOutlined />}
                </button>
              </div>
            )}
          </div>
        ))}

        <button
          className="menu-item danger"
          onClick={() => setShowLogoutModal(true)}
        >
          <div className="menu-item-left">
            <span className="menu-icon">
              <LogoutOutlined />
            </span>
            <span className="menu-label">{t("common.signOut")}</span>
          </div>
        </button>
      </div>

      <Modal
        title={t("modal.signOut")}
        open={showLogoutModal}
        onOk={handleLogout}
        onCancel={() => setShowLogoutModal(false)}
        okText={t("modal.yesSignOut")}
        cancelText={t("modal.cancel")}
        okButtonProps={{ danger: true }}
        centered
      >
        <p>{t("modal.signOutConfirm")}</p>
      </Modal>
    </div>
  );
}
