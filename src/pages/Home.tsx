import Header from "../features/home/HomeHeader";
import Body from "../features/home/HomeBody";
import Footer from "../features/home/HomeFooter";

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