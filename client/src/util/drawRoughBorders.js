import rough from "roughjs/bin/rough";
import anime from "animejs";

export const drawRoughBorders = async (table, svg, options = {}) => {
  if (!table || !svg) return;

  const {
    strokeColor = "#333",
    roughness = 2,
    totalAnimationDuration = 1500, // Fixed total animation time
    cancelAnimations,
    clearSVG,
    currentAnimationsRef,
  } = options;

  cancelAnimations();
  clearSVG();

  const roughSvg = rough.svg(svg);
  const { width, height } = table.getBoundingClientRect();
  svg.setAttribute("width", "100%");
  svg.setAttribute("height", "100%");
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.style.overflow = "visible";

  const drawStrokeAnime = (x1, y1, x2, y2, duration) => {
    return new Promise((resolve) => {
      let dummy = { progress: 0 };
      let line = roughSvg.line(x1, y1, x1, y1, {
        roughness,
        stroke: strokeColor,
      });

      const anim = anime({
        targets: dummy,
        progress: 1,
        duration,
        easing: "linear",
        update: () => {
          const newX = x1 + (x2 - x1) * dummy.progress;
          const newY = y1 + (y2 - y1) * dummy.progress;
          if (svg.contains(line)) svg.removeChild(line);
          line = roughSvg.line(x1, y1, newX, newY, {
            roughness,
            stroke: strokeColor,
          });
          svg.appendChild(line);
        },
        complete: () => {
          if (svg.contains(line)) svg.removeChild(line);
          line = roughSvg.line(x1, y1, x2, y2, {
            roughness,
            stroke: strokeColor,
          });
          svg.appendChild(line);
          resolve();
        },
      });

      currentAnimationsRef.current.push(anim);
    });
  };

  // Count lines
  const rows = table.querySelectorAll("tr");
  const cols = rows[0]?.querySelectorAll("th, td") || [];
  const numInnerLines = rows.length - 1 + (cols.length - 1);
  const numOuterLines = 4;
  const totalLines = numInnerLines + numOuterLines;

  // Determine per-line duration (keeping total animation time fixed)
  const perLineDuration = totalAnimationDuration / totalLines;

  let cumulativeY = 0;
  for (let i = 0; i < rows.length - 1; i++) {
    cumulativeY += rows[i].offsetHeight;
    await drawStrokeAnime(0, cumulativeY, width, cumulativeY, perLineDuration);
  }

  let cumulativeX = 0;
  for (let i = 0; i < cols.length - 1; i++) {
    cumulativeX += cols[i].offsetWidth;
    await drawStrokeAnime(cumulativeX, 0, cumulativeX, height, perLineDuration);
  }

  // Draw outer frame last
  await drawStrokeAnime(0, 0, width, 0, perLineDuration);
  await drawStrokeAnime(width, 0, width, height, perLineDuration);
  await drawStrokeAnime(width, height, 0, height, perLineDuration);
  await drawStrokeAnime(0, height, 0, 0, perLineDuration);
};
