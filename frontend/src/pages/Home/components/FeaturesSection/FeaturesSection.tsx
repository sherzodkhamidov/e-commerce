import { useTranslation } from "react-i18next";
import {
  CarOutlined,
  SafetyCertificateOutlined,
  SyncOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import "./FeaturesSection.css";

interface FeatureItem {
  icon: React.ReactNode;
  titleKey: string;
  descKey: string;
}

export default function FeaturesSection() {
  const { t } = useTranslation();

  const features: FeatureItem[] = [
    {
      icon: <CarOutlined />,
      titleKey: "home.freeShipping",
      descKey: "home.freeShippingDesc",
    },
    {
      icon: <SafetyCertificateOutlined />,
      titleKey: "home.securePayment",
      descKey: "home.securePaymentDesc",
    },
    {
      icon: <SyncOutlined />,
      titleKey: "home.easyReturns",
      descKey: "home.easyReturnsDesc",
    },
    {
      icon: <PhoneOutlined />,
      titleKey: "home.customerSupport",
      descKey: "home.customerSupportDesc",
    },
  ];

  return (
    <section className="features-section page-container">
      {features.map((feature, index) => (
        <div key={index} className="feature-card">
          <div className="feature-icon">{feature.icon}</div>
          <h3>{t(feature.titleKey)}</h3>
          <p>{t(feature.descKey)}</p>
        </div>
      ))}
    </section>
  );
}
