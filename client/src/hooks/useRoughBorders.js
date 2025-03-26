import { useEffect, useRef } from "react";
import { drawRoughBorders } from "../util/drawRoughBorders";
import { debounce } from "../util/debounce";

export const useRoughTableBorders = (tableRef, svgRef, dependencies = []) => {
  const currentAnimationsRef = useRef([]);
  const lastViewportSizeRef = useRef({
    width: window.innerWidth,
    height: window.innerHeight,
  });

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
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      const { width: prevWidth, height: prevHeight } =
        lastViewportSizeRef.current;

      // Only redraw if width changes or height changes significantly
      const heightChange = Math.abs(newHeight - prevHeight);
      if (newWidth !== prevWidth || heightChange > 100) {
        lastViewportSizeRef.current = { width: newWidth, height: newHeight };
        clearSVG();
        cancelAnimations();
        debouncedDraw();
      }
    };

    window.addEventListener("resize", handleResize);
    drawBorders();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimations();
    };
  }, dependencies);
};
