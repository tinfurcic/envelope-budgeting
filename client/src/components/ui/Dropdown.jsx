import { useState, useRef, useEffect } from "react";

const Dropdown = ({ options, selectedCurrency, setSelectedCurrency }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const buttonRef = useRef(null);
  const listRef = useRef(null);
  const selectRef = useRef(null);
  const queryRef = useRef("");

  // Open/close dropdown
  const toggleDropdown = () => setIsOpen((prev) => !prev);
  const closeDropdown = () => {
    setIsOpen(false);
    setHighlightedIndex(-1);
    queryRef.current = "";
  };

  // Sync the hidden <select> with the chosen option
  useEffect(() => {
    if (selectRef.current) {
      selectRef.current.value = selectedCurrency;
    }
  }, [selectedCurrency]);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === "Enter" || e.key === " ") {
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) => Math.min(prev + 1, options.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => Math.max(prev - 1, 0));
        break;
      case "Home":
        setHighlightedIndex(0);
        break;
      case "End":
        setHighlightedIndex(options.length - 1);
        break;
      case "Enter":
      case " ":
        if (highlightedIndex >= 0) {
          setSelectedCurrency(options[highlightedIndex]);
          closeDropdown();
        }
        break;
      case "Escape":
        closeDropdown();
        break;
      default:
        handleTypeToSelect(e.key);
        break;
    }
  };

  // Scroll highlighted item into view
  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll("[role='option']");
      items[highlightedIndex]?.scrollIntoView({ block: "nearest" });
    }
  }, [highlightedIndex, isOpen]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(e.target) &&
        listRef.current &&
        !listRef.current.contains(e.target)
      ) {
        closeDropdown();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Type-to-select functionality
  const handleTypeToSelect = (key) => {
    queryRef.current += key.toLowerCase();
    const matchIndex = options.findIndex(
      (opt) => opt && opt.toLowerCase().startsWith(queryRef.current),
    );

    if (matchIndex !== -1) {
      setHighlightedIndex(matchIndex);
    }

    setTimeout(() => (queryRef.current = ""), 1000); // Reset after delay
  };

  return (
    <div className="dropdown">
      {/* Hidden <select> for form handling */}
      <select
        ref={selectRef}
        defaultValue={selectedCurrency}
        aria-hidden="true"
        tabIndex={-1}
        className="hidden-from-sight"
      >
        {options.map((option, index) => (
          <option key={`select-${index}`} value={option}>
            {option}
          </option>
        ))}
      </select>

      {/* Custom dropdown button */}
      <button
        ref={buttonRef}
        onClick={toggleDropdown}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`dropdown__button ${isOpen ? "dropdown__button--active" : "dropdown__button--inactive"}`}
      >
        {selectedCurrency}
        {
          <svg width="24" height="24">
            <use href="#arrow-down" />
          </svg>
        }
      </button>

      {/* Custom dropdown options */}
      {isOpen && (
        <ul
          ref={listRef}
          className="dropdown__list"
          role="listbox"
          tabIndex={-1}
        >
          {options.map((option, index) => (
            <li
              key={`option-${index}`}
              role="option"
              aria-selected={highlightedIndex === index}
              className={`dropdown__item ${highlightedIndex === index ? "highlighted" : ""}`}
              onMouseEnter={() => setHighlightedIndex(index)}
              onClick={() => {
                setSelectedCurrency(option);
                closeDropdown();
                buttonRef.current.focus();
              }}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
