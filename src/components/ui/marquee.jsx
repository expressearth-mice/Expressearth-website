// Marquee.jsx
import { memo, useMemo } from "react";
import "./Marquee.css";

const Marquee = memo(function Marquee({ className = "", speedSec = 22 }) {
  const NB = "\u00A0";
  const DOT = `${NB}${NB}•${NB}${NB}`;

  const ariaText =
    "CELEBRATING 10 YEARS OF EXPRESSEARTH • A DECADE OF TRUST • 2015–2025 • CORPORATE & MICE EXCELLENCE •";

  const parts = useMemo(
    () => [
      { text: `CELEBRATING${NB}`, color: "#ffffff" },
      { text: `${NB}10 YEARS${NB}OF EXPRESSEARTH`, color: "#f5d27a" },
      { text: DOT, color: "#f5d27a" },
      { text: `A DECADE OF TRUST`, color: "#ffffff" },
      { text: DOT, color: "#f5d27a" },
      { text: `2015–2025`, color: "#f5d27a" },
      { text: DOT, color: "#f5d27a" },
      { text: `CORPORATE & MICE EXCELLENCE`, color: "#ffffff" },
      { text: DOT, color: "#f5d27a" },
    ],
    []
  );

  const renderMarqueeText = () =>
    parts.map((item, idx) => (
      <span key={idx} style={{ color: item.color, whiteSpace: "pre" }}>
        {item.text}
      </span>
    ));

  return (
    <div
      className={`ee-marquee ee-marquee--below-navbar ${className}`}
      style={{ ["--ee-marquee-speed"]: `${speedSec}s` }}
      aria-label={ariaText}
    >
      <div className="ee-marquee__wrap">
        <div className="ee-marquee__track" aria-hidden="true">
          {/* Start with copy-2 first, then copy-1
              so at loop moment it doesn't "suddenly hide" */}
          <div className="ee-marquee__item">{renderMarqueeText()}</div>
          <div className="ee-marquee__item">{renderMarqueeText()}</div>
          {/* optional extra copies (helps if text is short) */}
          <div className="ee-marquee__item">{renderMarqueeText()}</div>
          <div className="ee-marquee__item">{renderMarqueeText()}</div>
        </div>
      </div>
    </div>
  );
});

export default Marquee;
