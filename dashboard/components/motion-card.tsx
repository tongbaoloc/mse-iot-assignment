"use client";
import { motion } from "framer-motion";
import Card from "./card";

const MotionCard: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card title={title}>{children}</Card>
    </motion.div>
  );
};

export default MotionCard;
