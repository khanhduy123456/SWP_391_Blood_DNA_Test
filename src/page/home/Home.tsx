import React from "react";
import Header from "./HomeHeader";
import Body from "./HomeBody";
import Footer from "./HomeFooter";

export default function Homepage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow pt-16">
        <Body />
      </div>
      <Footer />
    </div>
  );
}