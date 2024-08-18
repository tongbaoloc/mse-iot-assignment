import React from "react";

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="text-center my-8 text-gray-400">
      ©{year} CopyRight IoT-Group 1. All rights reserved.
    </footer>
  );
};

export default Footer;
