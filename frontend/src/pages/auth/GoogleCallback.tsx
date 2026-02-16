import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Spin, message } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

export default function GoogleCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get("token");
        const needsPassword = urlParams.get("needs_password");
        const userString = urlParams.get("user");
        const error = urlParams.get("error");

        if (error) {
          message.error(error);
          navigate("/login");
          return;
        }

        if (!token || !userString) {
          message.error("Invalid OAuth response");
          navigate("/login");
          return;
        }

        const user = JSON.parse(userString);

        // Store token and user data
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        // Redirect based on whether user needs to set password
        if (needsPassword === "true") {
          message.success("Welcome! Please set a password for your account");
          navigate("/set-password");
        } else {
          message.success("Successfully logged in!");
          navigate("/");
        }

        // Reload to update auth state
        window.location.reload();
      } catch (error: any) {
        console.error("OAuth callback error:", error);
        message.error("Failed to complete OAuth login");
        navigate("/login");
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        gap: "16px",
      }}
    >
      <Spin
        indicator={
          <LoadingOutlined
            style={{ fontSize: 48, color: "var(--primary-color)" }}
            spin
          />
        }
      />
    </div>
  );
}
