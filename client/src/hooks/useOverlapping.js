import { useEffect, useState } from "react";
import { debounce } from "../util/debounce";

const useOverlapping = (
  containerSelector,
  targetSelector,
  otherElementsSelectors = [],
  delay = 500,
  dependency = [],
) => {
  const [isOverlapping, setIsOverlapping] = useState(false);

  useEffect(() => {
    const container = document.querySelector(containerSelector);
    const target = document.querySelector(targetSelector);

    if (!container || !target) {
      setIsOverlapping(false);
      return;
    }

    // Collect all matching elements from all provided selectors
    const otherElements = otherElementsSelectors.flatMap((selector) =>
      Array.from(document.querySelectorAll(selector)),
    );

    if (otherElements.length === 0) {
      setIsOverlapping(false);
      return;
    }

    const checkOverlap = () => {
      const targetRect = target.getBoundingClientRect();
      let overlapDetected = false;

      otherElements.forEach((element) => {
        const elementRect = element.getBoundingClientRect();
        if (
          targetRect.top < elementRect.bottom &&
          targetRect.bottom > elementRect.top &&
          targetRect.left < elementRect.right &&
          targetRect.right > elementRect.left
        ) {
          overlapDetected = true;
        }
      });

      setIsOverlapping(overlapDetected);
    };

    const debouncedCheckOverlap = debounce(checkOverlap, delay);

    container.addEventListener("scroll", debouncedCheckOverlap);
    window.addEventListener("resize", debouncedCheckOverlap);

    // Initial check
    checkOverlap();

    return () => {
      container.removeEventListener("scroll", debouncedCheckOverlap);
      window.removeEventListener("resize", debouncedCheckOverlap);
    };
  }, [
    containerSelector,
    targetSelector,
    otherElementsSelectors,
    delay,
    ...dependency,
  ]);

  return isOverlapping;
};

export default useOverlapping;
