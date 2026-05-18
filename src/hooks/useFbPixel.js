import { useEffect } from "react";
import { trackPageView } from "../utils/fbPixel";

export const useFbPixel = () => {
  useEffect(() => {
    trackPageView();
  }, []);
};

export default useFbPixel;
