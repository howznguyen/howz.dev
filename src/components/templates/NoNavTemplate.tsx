"use client";

import React from "react";
import { Footer } from "@/components/organisms";

interface NoNavTemplateProps {
  children: React.ReactNode;
}

const NoNavTemplate = ({ children }: NoNavTemplateProps) => {
  return (
    <div className="min-h-screen bg-white dark:bg-dark">
      <main className="min-h-screen">{children}</main>
      <Footer />
    </div>
  );
};

export default NoNavTemplate;
