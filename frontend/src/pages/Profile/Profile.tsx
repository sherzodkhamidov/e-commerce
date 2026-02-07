import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  UserOutlined,
  LockOutlined,
  ShoppingOutlined,
  HeartOutlined,
  SettingOutlined,
  LogoutOutlined,
  EditOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Form,
  Input,
  Button,
  message,
  Divider,
  Switch,
  Tabs,
} from "antd";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { Link } from "react-router-dom";
import "./Profile.css";

type TabKey = "account" | "security" | "orders" | "wishlist" | "settings";

export default function Profile() {
  const { t } = useTranslation();
  const { user, updateProfile, updatePassword, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<TabKey>("account");
  const [isEditing, setIsEditing] = useState(false);
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleProfileSubmit = async (values: {
    name: string;
    email: string;
  }) => {
    setProfileLoading(true);
    try {
      await updateProfile(values.name, values.email);
      message.success(t("profile.updateSuccess") || "Profile updated!");
      setIsEditing(false);
    } catch {
      message.error(t("profile.updateError") || "Update failed");
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (values: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error(t("profile.passwordMismatch") || "Passwords don't match");
      return;
    }
    setPasswordLoading(true);
    try {
      await updatePassword(
        values.currentPassword,
        values.newPassword,
        values.confirmPassword,
      );
      message.success(t("profile.passwordSuccess") || "Password updated!");
      passwordForm.resetFields();
    } catch {
      message.error(t("profile.passwordError") || "Update failed");
    } finally {
      setPasswordLoading(false);
    }
  };

  const tabItems = [
    {
      key: "account",
      label: (
        <span className="tab-label">
          <UserOutlined />
          <span className="tab-text">{t("profile.account") || "Account"}</span>
        </span>
      ),
      children: (
        <div className="tab-content">
          <div className="content-header">
            <h2>{t("profile.personalInfo") || "Personal Information"}</h2>
            {!isEditing && (
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={() => setIsEditing(true)}
              >
                {t("common.edit") || "Edit"}
              </Button>
            )}
          </div>
          <Form
            form={profileForm}
            layout="vertical"
            initialValues={{ name: user?.name, email: user?.email }}
            onFinish={handleProfileSubmit}
            disabled={!isEditing}
            className="profile-form"
          >
            <Form.Item
              name="name"
              label={t("profile.fullName") || "Full Name"}
              rules={[{ required: true, message: "Required" }]}
            >
              <Input size="large" placeholder="Your name" />
            </Form.Item>
            <Form.Item
              name="email"
              label={t("profile.email") || "Email"}
              rules={[{ required: true }, { type: "email" }]}
            >
              <Input size="large" placeholder="your@email.com" />
            </Form.Item>
            {isEditing && (
              <div className="form-buttons">
                <Button onClick={() => setIsEditing(false)}>
                  {t("common.cancel") || "Cancel"}
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  loading={profileLoading}
                >
                  {t("common.save") || "Save"}
                </Button>
              </div>
            )}
          </Form>
        </div>
      ),
    },
    {
      key: "security",
      label: (
        <span className="tab-label">
          <LockOutlined />
          <span className="tab-text">
            {t("profile.security") || "Security"}
          </span>
        </span>
      ),
      children: (
        <div className="tab-content">
          <div className="content-header">
            <h2>{t("profile.changePassword") || "Change Password"}</h2>
          </div>
          <Form
            form={passwordForm}
            layout="vertical"
            onFinish={handlePasswordSubmit}
            className="profile-form"
          >
            <Form.Item
              name="currentPassword"
              label={t("profile.currentPassword") || "Current Password"}
              rules={[{ required: true }]}
            >
              <Input.Password size="large" />
            </Form.Item>
            <Form.Item
              name="newPassword"
              label={t("profile.newPassword") || "New Password"}
              rules={[
                { required: true },
                { min: 8, message: "Min 8 characters" },
              ]}
            >
              <Input.Password size="large" />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              label={t("profile.confirmPassword") || "Confirm Password"}
              rules={[{ required: true }]}
            >
              <Input.Password size="large" />
            </Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={passwordLoading}
              block
              size="large"
            >
              {t("profile.updatePassword") || "Update Password"}
            </Button>
          </Form>
        </div>
      ),
    },
    {
      key: "orders",
      label: (
        <span className="tab-label">
          <ShoppingOutlined />
          <span className="tab-text">{t("profile.orders") || "Orders"}</span>
        </span>
      ),
      children: (
        <div className="tab-content">
          <div className="content-header">
            <h2>{t("profile.orderHistory") || "Order History"}</h2>
          </div>
          <div className="empty-state">
            <ShoppingOutlined className="empty-icon" />
            <h3>{t("profile.noOrders") || "No orders yet"}</h3>
            <p>
              {t("profile.noOrdersDesc") || "Start shopping to see your orders"}
            </p>
            <Link to="/shop">
              <Button type="primary">
                {t("profile.startShopping") || "Shop Now"}
              </Button>
            </Link>
          </div>
        </div>
      ),
    },
    {
      key: "wishlist",
      label: (
        <span className="tab-label">
          <HeartOutlined />
          <span className="tab-text">
            {t("profile.wishlist") || "Wishlist"}
          </span>
        </span>
      ),
      children: (
        <div className="tab-content">
          <div className="content-header">
            <h2>{t("profile.myWishlist") || "My Wishlist"}</h2>
          </div>
          <div className="empty-state">
            <HeartOutlined className="empty-icon" />
            <h3>{t("profile.emptyWishlist") || "Wishlist is empty"}</h3>
            <p>{t("profile.emptyWishlistDesc") || "Save items you love"}</p>
            <Link to="/shop">
              <Button type="primary">
                {t("profile.browseProducts") || "Browse"}
              </Button>
            </Link>
          </div>
        </div>
      ),
    },
    {
      key: "settings",
      label: (
        <span className="tab-label">
          <SettingOutlined />
          <span className="tab-text">
            {t("profile.settings") || "Settings"}
          </span>
        </span>
      ),
      children: (
        <div className="tab-content">
          <div className="content-header">
            <h2>{t("profile.appSettings") || "Settings"}</h2>
          </div>
          <div className="settings-list">
            <div className="setting-row">
              <div>
                <h4>{t("profile.darkMode") || "Dark Mode"}</h4>
                <p>{t("profile.darkModeDesc") || "Toggle dark theme"}</p>
              </div>
              <Switch checked={theme === "dark"} onChange={toggleTheme} />
            </div>
            <Divider />
            <div className="setting-row">
              <div>
                <h4>{t("profile.notifications") || "Notifications"}</h4>
                <p>{t("profile.notificationsDesc") || "Email updates"}</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="profile-page page-container">
      {/* User Header */}
      <div className="profile-header">
        <Avatar size={72} className="profile-avatar">
          {user?.name?.charAt(0).toUpperCase()}
        </Avatar>
        <div className="profile-info">
          <h1>{user?.name}</h1>
          <p>{user?.email}</p>
        </div>
        <Button
          type="text"
          danger
          icon={<LogoutOutlined />}
          onClick={logout}
          className="logout-btn"
        >
          {t("common.signOut") || "Sign Out"}
        </Button>
      </div>

      {/* Tabs */}
      <Tabs
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key as TabKey)}
        items={tabItems}
        className="profile-tabs"
        tabPosition="top"
      />
    </div>
  );
}
