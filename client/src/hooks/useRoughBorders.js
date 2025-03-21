import { useEffect, useRef } from "react";
import { drawRoughBorders } from "../util/drawRoughBorders";
import { debounce } from "../util/debounce";

export const useRoughTableBorders = (tableRef, svgRef, dependencies = []) => {
  const currentAnimationsRef = useRef([]);

  const cancelAnimations = () => {
    currentAnimationsRef.current.forEach((anim) => anim.pause());
    currentAnimationsRef.current = [];
  };

  const clearSVG = () => {
    if (svgRef.current) {
      while (svgRef.current.firstChild) {
        svgRef.current.removeChild(svgRef.current.firstChild);
      }
    }
  };

  useEffect(() => {
    const drawBorders = () => {
      drawRoughBorders(tableRef.current, svgRef.current, {
        strokeColor: "#333",
        roughness: 2,
        animationDuration: 200,
        cancelAnimations,
        clearSVG,
        currentAnimationsRef,
      });
    };

    const debouncedDraw = debounce(drawBorders, 200);
    const handleResize = () => {
      clearSVG();
      cancelAnimations();
      debouncedDraw();
    };

    window.addEventListener("resize", handleResize);
    drawBorders();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimations();
    };
  }, dependencies);
};
