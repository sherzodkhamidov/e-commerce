import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Form, Input, Button, Dropdown } from "antd";
import type { MenuProps } from "antd";
import {
  MailOutlined,
  LockOutlined,
  LoginOutlined,
  ExclamationCircleOutlined,
  DownOutlined,
  GoogleOutlined,
} from "@ant-design/icons";
import "./Auth.css";
import { useTranslation } from "react-i18next";
import UzbFlag from "../../assets/flags/uzbekistan.png";
import RuFlag from "../../assets/flags/russia.png";
import EnFlag from "../../assets/flags/english.png";

interface LoginFormValues {
  email: string;
  password: string;
}

export default function Login() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();
  const { t, i18n } = useTranslation();
  const [form] = Form.useForm();

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
      label: "English",
      icon: <img src={EnFlag} alt="EN" className="auth-flag-icon" />,
    },
    {
      key: "ru",
      label: "Русский",
      icon: <img src={RuFlag} alt="RU" className="auth-flag-icon" />,
    },
    {
      key: "uz",
      label: "O'zbek",
      icon: <img src={UzbFlag} alt="UZ" className="auth-flag-icon" />,
    },
  ];

  const handleSubmit = async (values: LoginFormValues) => {
    setError("");
    setIsLoading(true);

    try {
      await login(values.email, values.password);
      navigate("/");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || t("login.invalidCredentials"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    loginWithGoogle();
  };

  return (
    <div className="auth-container">
      <div className="auth-background"></div>

      <div className="auth-language-selector">
        <Dropdown menu={{ items: languageItems, onClick: changeLanguage }}>
          <Button type="text" className="auth-language-btn">
            <img
              src={getLanguageFlag()}
              alt={i18n.language}
              className="auth-flag-icon"
            />
            {i18n.language.toUpperCase()}
            <DownOutlined style={{ fontSize: 10 }} />
          </Button>
        </Dropdown>
      </div>

      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <LoginOutlined />
          </div>
          <h1>{t("login.login_page_title")}</h1>
          <p>{t("login.login_page_description")}</p>
        </div>

        {error && (
          <div className="error-message">
            <ExclamationCircleOutlined />
            {error}
          </div>
        )}

        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
          className="auth-form"
        >
          <Form.Item
            name="email"
            label={t("login.email")}
            rules={[
              { required: true, message: t("login.field_required") },
              { type: "email", message: t("login.emailInvalid") },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="email@example.com"
              size="large"
              autoComplete="email"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={t("login.password")}
            rules={[{ required: true, message: t("login.field_required") }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="••••••••"
              size="large"
              autoComplete="current-password"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              block
              size="large"
              className="submit-button"
              icon={<LoginOutlined />}
            >
              {t("login.signIn")}
            </Button>
          </Form.Item>

          <div className="auth-divider">
            <span>{t("login.continueWith")}</span>
          </div>

          <Button
            type="default"
            onClick={handleGoogleLogin}
            block
            size="large"
            className="google-button"
            icon={<GoogleOutlined />}
          >
            {t("login.signInWithGoogle")}
          </Button>

          <p className="auth-link">
            {t("login.dontHaveAccount")}{" "}
            <Link to="/register">{t("login.signUp")}</Link>
          </p>
        </Form>
      </div>
    </div>
  );
}
