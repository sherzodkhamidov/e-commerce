import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Form, Input, Button, Dropdown } from "antd";
import type { MenuProps } from "antd";
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  UserAddOutlined,
  ExclamationCircleOutlined,
  DownOutlined,
  GoogleOutlined,
} from "@ant-design/icons";
import "./Auth.css";
import { useTranslation } from "react-i18next";
import UzbFlag from "../../assets/flags/uzbekistan.png";
import RuFlag from "../../assets/flags/russia.png";
import EnFlag from "../../assets/flags/english.png";

interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

export default function Register() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { register, registerWithGoogle } = useAuth();
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

  const handleSubmit = async (values: RegisterFormValues) => {
    setError("");
    setIsLoading(true);

    try {
      await register(
        values.name,
        values.email,
        values.password,
        values.passwordConfirmation,
      );
      navigate("/");
    } catch (err: unknown) {
      const error = err as {
        response?: {
          data?: { message?: string; errors?: Record<string, string[]> };
        };
      };
      if (error.response?.data?.errors) {
        const firstError = Object.values(error.response.data.errors)[0];
        if (firstError?.[0] === "The email has already been taken.") {
          setError(t("register.emailAlreadyExists"));
        } else {
          setError(firstError?.[0] || "Registration failed");
        }
      } else {
        if (
          error.response?.data?.message === "The email has already been taken."
        ) {
          setError(t("register.emailAlreadyExists"));
        } else {
          setError("Registration failed");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = () => {
    registerWithGoogle();
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
            <UserAddOutlined />
          </div>
          <h1>{t("register.title")}</h1>
          <p>{t("register.subtitle")}</p>
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
            name="name"
            label={t("register.name")}
            rules={[
              { required: true, message: t("register.field_required") },
              { min: 2, message: t("register.nameTooShort") },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder={t("register.namePlaceholder")}
              size="large"
              autoComplete="name"
            />
          </Form.Item>

          <Form.Item
            name="email"
            label={t("register.email")}
            rules={[
              { required: true, message: t("register.field_required") },
              { type: "email", message: t("register.emailInvalid") },
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
            label={t("register.password")}
            rules={[
              { required: true, message: t("register.field_required") },
              { min: 8, message: t("register.passwordTooShort") },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="••••••••"
              size="large"
              autoComplete="new-password"
            />
          </Form.Item>

          <Form.Item
            name="passwordConfirmation"
            label={t("register.confirmPassword")}
            dependencies={["password"]}
            rules={[
              {
                required: true,
                message: t("register.field_required"),
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(t("register.passwordsDoNotMatch")),
                  );
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="••••••••"
              size="large"
              autoComplete="new-password"
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
              icon={<UserAddOutlined />}
            >
              {t("register.signUp")}
            </Button>
          </Form.Item>

          <div className="auth-divider">
            <span>{t("register.continueWith")}</span>
          </div>

          <Button
            type="default"
            onClick={handleGoogleRegister}
            block
            size="large"
            className="google-button"
            icon={<GoogleOutlined />}
          >
            {t("register.signUpWithGoogle")}
          </Button>

          <p className="auth-link">
            {t("register.alreadyHaveAccount")}{" "}
            <Link to="/login">{t("register.signIn")}</Link>
          </p>
        </Form>
      </div>
    </div>
  );
}
