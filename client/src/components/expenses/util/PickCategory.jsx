import React, { Fragment, useState } from "react";
import Button from "../../ui/Button";

const PickCategory = ({
  sourceCategory,
  handleCategoryChange,
  activeCategoryFromLocation,
}) => {
  const [activeCategory, setActiveCategory] = useState(
    activeCategoryFromLocation ?? "",
  );

  const handleClick = (category) => {
    handleCategoryChange(category);
    setActiveCategory(category);
  };

  return (
    <>
      {/* Hidden raw radio buttons for accessibility */}
      <fieldset className="hidden-from-sight">
        <legend>Source</legend>
        {["envelope", "savings"].map((category) => (
          <Fragment key={category}>
            <label htmlFor={category}>
              <input
                type="radio"
                value={category}
                id={category}
                name="source-category"
                checked={sourceCategory === category}
                onChange={() => handleCategoryChange(category)}
              />
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </label>
          </Fragment>
        ))}
      </fieldset>

      {/* Styled buttons replacing radio buttons visually */}
      <div
        className="category-button-group"
        role="group"
        aria-label="Select Category"
      >
        {["envelope", "savings"].map((category) => (
          <Button
            key={category}
            className={`button button--category ${activeCategory === category ? "active" : "inactive"}`}
            onClick={() => handleClick(category)}
            //onTouchEnd={() => handleClick(category)}
            disabled={false}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Button>
        ))}
      </div>
    </>
  );
};

export default PickCategory;
