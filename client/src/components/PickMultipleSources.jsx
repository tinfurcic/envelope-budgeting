import React, { useEffect, useMemo, Fragment } from "react";
import { addSourcesInOrder } from "../util/addSourcesInOrder";
import { getContrastColor } from "../util/getContrastColor";
import Button from "./Button";

const PickMultipleSources = ({
  newExpenseAmount,
  newExpenseSources,
  setNewExpenseSources,
  envelopes,
  savings,
}) => {
  const fakeCurrency = "€";

  const potentialSources = useMemo(
    () => [...envelopes, ...Object.values(savings)],
    [envelopes, savings],
  );

  // sum of all entered amounts
  const totalEnteredAmount = newExpenseSources.reduce(
    (sum, source) => sum + (parseFloat(source.amount) || 0),
    0,
  );

  const handleSourceAmountsChange = (event, key) => {
    let value = event.target.value;
    value = value.replace(/,/g, ".");
    const regex = /^(|0|0\.|0\.\d{1,2}|[1-9]\d*(\.|\.\d{1,2})?)$/;

    if (regex.test(value)) {
      const numericValue = parseFloat(value) || 0;
      const otherValuesSum =
        totalEnteredAmount -
        (parseFloat(
          newExpenseSources.find((source) => source.id === key)?.amount,
        ) || 0);

      if (numericValue + otherValuesSum > newExpenseAmount) {
        value = Math.max(newExpenseAmount - otherValuesSum, 0)
          .toFixed(2)
          .toString();
      }

      setNewExpenseSources((prevSources) => {
        const updatedSources = prevSources.map((source) => {
          // Update the amount for the matching source
          if (source.id === key) {
            return {
              ...source,
              amount: value, // Update the amount directly in the source
            };
          }
          return source; // If it's not the matching source, leave it unchanged
        });

        return updatedSources;
      });
    }
  };

  const handleChoice = (sourceId) => {
    const existingSource = newExpenseSources.find(
      (item) => item.id === sourceId,
    );

    if (existingSource) {
      setNewExpenseSources((prevSources) =>
        prevSources.filter((source) => source.id !== sourceId),
      );
    } else {
      const source = potentialSources.find((item) => item.id === sourceId);
      if (!source) return;

      let type, order, name, color;
      if (source.id > 0) {
        [type, order, name, color] = [
          "envelope",
          source.order,
          source.name,
          source.color,
        ];
      } else if (source.id === -1) {
        [type, order, name, color] = [
          "shortTermSavings",
          -1,
          "Short term savings",
          "#000080",
        ];
      } else if (source.id === -2) {
        [type, order, name, color] = [
          "longTermSavings",
          -2,
          "Long term savings",
          "#000080",
        ];
      }

      setNewExpenseSources(
        addSourcesInOrder(newExpenseSources, {
          id: source.id,
          type,
          name,
          amount: "",
          color,
          order,
        }),
      );
    }
  };

  // when newExpenseAmount changes, reset all amount fields
  useEffect(() => {
    setNewExpenseSources((prevSources) =>
      prevSources.map((source) => ({ ...source, amount: "" })),
    );
  }, [newExpenseAmount, setNewExpenseSources]);

  // Set maximum input value to match the amount in the source
  useEffect(() => {
    for (const expenseSource of newExpenseSources) {
      const id = expenseSource.id;
      const source = potentialSources.find((item) => item.id === Number(id));
      if (source && expenseSource.amount > source.currentAmount) {
        setNewExpenseSources((prev) =>
          prev.map((expenseSource) =>
            expenseSource.id === id
              ? { ...expenseSource, amount: source.currentAmount }
              : expenseSource,
          ),
        );
      }
    }
  }, [newExpenseSources, potentialSources, setNewExpenseSources]);

  return (
    <>
      {/* Native checkboxes for screen readers */}
      <fieldset className="hidden-from-sight">
        <legend>Choose where to pay from:</legend>
        {potentialSources.map((source) => (
          <Fragment key={source.id}>
            <input
              type="checkbox"
              id={source.id}
              name={source.name}
              onChange={handleChoice}
              disabled={source.currentAmount === 0}
            />
            <label htmlFor={source.id}>{source.name}</label>
          </Fragment>
        ))}
      </fieldset>

      {/* Buttons replacing checkboxes visually */}
      {/*<p>Choose where to pay from:</p>*/}
      <div
        className="source-button-group"
        role="group"
        aria-label="Select Sources"
      >
        {potentialSources.map((source) => {
          const isSelected = newExpenseSources.some((s) => s.id === source.id);
          const isDisabled = source.currentAmount === 0;
          const textColor = getContrastColor(source.color);
          return (
            <Button
              key={source.id}
              type="button"
              className={`button button--source ${
                isDisabled
                  ? "disabled inactive"
                  : isSelected
                    ? "active"
                    : "inactive"
              }`}
              extraStyle={{
                "--envelope-color": source.color,
                "--envelope-text-color": textColor,
              }}
              onClick={() => handleChoice(source.id)}
              disabled={isDisabled}
            >
              <span className="button--source__name">{source.name}</span>{" "}
              <span className="button--source__amount">
                {fakeCurrency}
                {source.currentAmount}
              </span>
            </Button>
          );
        })}
      </div>

      {/* Fieldset for screen readers */}
      {newExpenseSources.length !== 0 && (
        <fieldset className="hidden-from-sight">
          <legend>Enter Amounts</legend>
          <div>
            {newExpenseSources.map((source) => (
              <div key={source.id}>
                <label htmlFor={`amount-${source.id}`}>
                  Amount from {source.name}
                </label>
                <div>
                  <span>{fakeCurrency}</span>
                  <input
                    type="text"
                    value={source.amount || ""}
                    onChange={(e) => handleSourceAmountsChange(e, source.id)}
                    id={`amount-${source.id}`}
                    name={`amount-${source.id}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </fieldset>
      )}

      {/* Input fields for selected sources */}
      {newExpenseSources.length !== 0 && (
        <div
          className="input-field-group"
          role="group"
          aria-labelledby="amounts-title"
        >
          <div id="amounts-title" className="hidden-from-sight">
            Enter Amounts
          </div>
          {newExpenseSources.map((source) => (
            <div key={source.id}>
              <label htmlFor={`amount-${source.id}`} className="form-label">
                Amount from {source.name}
              </label>
              <div className="input-with-currency">
                <span className="input-with-currency__currency">
                  {fakeCurrency}
                </span>
                <input
                  className="form-input input-with-currency__input"
                  type="text"
                  value={source.amount || ""}
                  onChange={(e) => handleSourceAmountsChange(e, source.id)}
                  id={`amount-${source.id}`}
                  name={`amount-${source.id}`}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default PickMultipleSources;
