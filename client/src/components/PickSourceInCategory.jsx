import React from "react";
import Button from "./Button";
import { getContrastColor } from "../util/getContrastColor";

const PickSourceInCategory = ({
  sourceCategory,
  envelopes,
  savings,
  newExpenseAmount,
  selectedSourceId,
  handleSelectedSourceChange,
}) => {
  const fakeCurrency = "€";

  return (
    <>
      {/* Native <select>, kept for screen readers and form functionality */}
      {sourceCategory !== null && (
        <div>
          <label htmlFor="envelope-select"></label>
          <select
            name="envelope-select"
            id="envelope-select"
            onChange={handleSelectedSourceChange}
            value={selectedSourceId}
            className="hidden-from-sight"
          >
            {envelopes.length === 0 && sourceCategory === "envelope" ? (
              <option value="">No envelopes to select from.</option>
            ) : sourceCategory === "envelope" ? (
              <>
                <option key="0" value="">
                  Select an envelope
                </option>
                {envelopes.map((envelope) => (
                  <option
                    key={envelope.id}
                    value={envelope.id}
                    disabled={
                      envelope.currentAmount < newExpenseAmount ||
                      envelope.currentAmount === 0
                    }
                  >
                    {envelope.name} ({fakeCurrency}
                    {envelope.currentAmount} left)
                  </option>
                ))}
              </>
            ) : (
              sourceCategory === "savings" && (
                <>
                  <option value="">Select savings type</option>
                  <option
                    value={-1}
                    disabled={
                      savings.shortTermSavings.currentAmount <
                        newExpenseAmount ||
                      savings.shortTermSavings.currentAmount === 0
                    }
                  >
                    Short term savings ({fakeCurrency}
                    {savings.shortTermSavings.currentAmount} left)
                  </option>
                  <option
                    value={-2}
                    disabled={
                      savings.longTermSavings.currentAmount <
                        newExpenseAmount ||
                      savings.longTermSavings.currentAmount === 0
                    }
                  >
                    Long term savings ({fakeCurrency}
                    {savings.longTermSavings.currentAmount} left)
                  </option>
                </>
              )
            )}
          </select>
        </div>
      )}

      {/* Buttons replacing the <select> visually */}
      {sourceCategory !== null && (
        <div
          className="source-button-group"
          role="group"
          aria-label="Select Source"
        >
          {envelopes.length === 0 && sourceCategory === "envelope" ? (
            <p>No envelopes to select from.</p>
          ) : sourceCategory === "envelope" ? (
            <>
              {envelopes.map((envelope) => {
                const isDisabled =
                  envelope.currentAmount < newExpenseAmount ||
                  envelope.currentAmount === 0;
                return (
                  <Button
                    key={envelope.id}
                    type="button"
                    className={`button button--source ${isDisabled ? "disabled inactive" : selectedSourceId === envelope.id ? "active" : "inactive"}`}
                    extraStyle={{ "--envelope-color": envelope.color }}
                    onClick={(e) =>
                      handleSelectedSourceChange({
                        target: { value: envelope.id },
                      })
                    }
                    disabled={isDisabled}
                  >
                    {envelope.name} ({fakeCurrency}
                    {envelope.currentAmount})
                  </Button>
                );
              })}
            </>
          ) : (
            sourceCategory === "savings" && (
              <>
                {Object.values(savings).map((savingsCategory) => {
                  const isDisabled =
                    savingsCategory.currentAmount < newExpenseAmount ||
                    savingsCategory.currentAmount === 0;
                  const textColor = getContrastColor(savingsCategory.color);
                  return (
                    <Button
                      key={savingsCategory.id}
                      type="button"
                      className={`button button--source ${isDisabled ? "disabled inactive" : selectedSourceId === savingsCategory.id ? "active" : "inactive"}`}
                      extraStyle={{
                        "--envelope-color": savingsCategory.color,
                        "--envelope-text-color": textColor,
                      }}
                      onClick={(e) =>
                        handleSelectedSourceChange({
                          target: { value: savingsCategory.id },
                        })
                      }
                      disabled={isDisabled}
                    >
                      {savingsCategory.name || "asdf"} ({fakeCurrency}
                      {savingsCategory.currentAmount})
                    </Button>
                  );
                })}
              </>
            )
          )}
        </div>
      )}
    </>
  );
};

export default PickSourceInCategory;
