import type React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function ImageSlider(): React.ReactElement {
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="w-full h-64 md:h-96">
      <Slider {...sliderSettings}>
        <div>
          <img
            src="/assets/images/BANNER-ADN1.jpg"
            alt="Slide 1"
            className="w-full h-full object-cover"
            onError={(e) => console.log("Image failed to load:", e)}
          />
        </div>
        <div>
          <img
            src="/assets/images/BANNER-ADN2.jpg"
            alt="Slide 2"
            className="w-full h-full object-cover"
            onError={(e) => console.log("Image failed to load:", e)}
          />
        </div>
      </Slider>
    </div>
  );
}