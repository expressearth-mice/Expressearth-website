import React from "react";
import "./Skeleton.css";

const Skeleton = ({ className = "", style = {} }) => (
  <div className={`skeleton ${className}`} style={style} />
);

export default Skeleton;
