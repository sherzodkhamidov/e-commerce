import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Form, Input, Button } from "antd";
import {
  LockOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import "../auth/Auth.css";
import { useTranslation } from "react-i18next";

interface SetPasswordFormValues {
  password: string;
  passwordConfirmation: string;
}

export default function SetPassword() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setPassword } = useAuth();
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const handleSubmit = async (values: SetPasswordFormValues) => {
    setError("");
    setIsLoading(true);

    try {
      await setPassword(values.password, values.passwordConfirmation);
      navigate("/");
    } catch (err: unknown) {
      const error = err as {
        response?: {
          data?: { message?: string; errors?: Record<string, string[]> };
        };
      };
      if (error.response?.data?.errors) {
        const firstError = Object.values(error.response.data.errors)[0];
        setError(firstError?.[0] || "Failed to set password");
      } else {
        setError(error.response?.data?.message || "Failed to set password");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-background"></div>

      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <CheckCircleOutlined />
          </div>
          <h1>{t("setPassword.title")}</h1>
          <p>{t("setPassword.subtitle")}</p>
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
            name="password"
            label={t("setPassword.password")}
            rules={[
              { required: true, message: t("setPassword.field_required") },
              { min: 8, message: t("setPassword.passwordTooShort") },
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
            label={t("setPassword.confirmPassword")}
            dependencies={["password"]}
            rules={[
              {
                required: true,
                message: t("setPassword.field_required"),
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(t("setPassword.passwordsDoNotMatch")),
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
              icon={<CheckCircleOutlined />}
            >
              {t("setPassword.setPassword")}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
