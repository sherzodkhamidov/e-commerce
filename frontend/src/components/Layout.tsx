import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import Modal from "./Modal";

import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";
import MobileBottomNav from "./MobileBottomNav/MobileBottomNav";
import "../styles/layout.css";

export default function Layout() {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    setShowLogoutModal(false);
    logout();
  };

  return (
    <div className="app-layout">
      <Navbar onLogoutClick={() => setShowLogoutModal(true)} />

      <main className="main-content">
        <Outlet />
      </main>

      <Footer />

      <MobileBottomNav />

      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title={t("modal.signOut")}
        confirmText={t("modal.yesSignOut")}
        cancelText={t("modal.cancel")}
        onConfirm={handleLogout}
        confirmVariant="danger"
      >
        <p>{t("modal.signOutConfirm")}</p>
      </Modal>

      {/* Mobile Navigation Components */}
    </div>
  );
}
