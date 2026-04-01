import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const HorizontalSlider = ({
  children,
  className = "",
  shellClassName = "slider-shell",
  arrowClassName = "slider-arrow",
  amount = 320,
  itemCount = 0,
  leftAriaLabel = "Scroll left",
  rightAriaLabel = "Scroll right",
}) => {
  const sliderRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return undefined;

    const updateArrowState = () => {
      const maxScrollLeft = slider.scrollWidth - slider.clientWidth;
      setCanScrollLeft(slider.scrollLeft > 8);
      setCanScrollRight(maxScrollLeft - slider.scrollLeft > 8);
    };

    updateArrowState();
    slider.addEventListener("scroll", updateArrowState, { passive: true });
    window.addEventListener("resize", updateArrowState);
    const frame = window.requestAnimationFrame(updateArrowState);

    return () => {
      slider.removeEventListener("scroll", updateArrowState);
      window.removeEventListener("resize", updateArrowState);
      window.cancelAnimationFrame(frame);
    };
  }, [itemCount]);

  const scrollByDirection = (direction) => {
    const slider = sliderRef.current;
    if (!slider) return;

    slider.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <div className={shellClassName}>
      {canScrollLeft && (
        <button
          type="button"
          className={`${arrowClassName} ${arrowClassName}-left`}
          onClick={() => scrollByDirection("left")}
          aria-label={leftAriaLabel}
        >
          <ChevronLeft size={24} />
        </button>
      )}

      <div ref={sliderRef} className={className}>
        {children}
      </div>

      {canScrollRight && (
        <button
          type="button"
          className={`${arrowClassName} ${arrowClassName}-right`}
          onClick={() => scrollByDirection("right")}
          aria-label={rightAriaLabel}
        >
          <ChevronRight size={24} />
        </button>
      )}
    </div>
  );
};

export default HorizontalSlider;
