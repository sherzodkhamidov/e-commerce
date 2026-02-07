import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, type Variants } from "framer-motion";
import { ArrowRightOutlined } from "@ant-design/icons";
import "./HeroSection.css";

export default function HeroSection() {
  const { t } = useTranslation();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
      },
    },
  };

  const buttonVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <section className="hero-section">
      <div className="hero-background">
        <div className="hero-gradient"></div>
      </div>
      <motion.div
        className="hero-content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.span className="hero-badge" variants={itemVariants}>
          {t("home.newCollection") as string}
        </motion.span>
        <motion.h1 variants={itemVariants}>
          {t("home.discoverAmazing") as string}
        </motion.h1>
        <motion.p variants={itemVariants}>
          {t("home.shopLatestTrends") as string}
        </motion.p>
        <motion.div className="hero-actions" variants={itemVariants}>
          <motion.div variants={buttonVariants}>
            <Link to="/shop" className="hero-btn">
              {t("home.shopNow") as string}
              <ArrowRightOutlined />
            </Link>
          </motion.div>
          <motion.div variants={buttonVariants}>
            <Link to="/shop?featured=1" className="hero-btn">
              {t("home.viewFeatured") as string}
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
