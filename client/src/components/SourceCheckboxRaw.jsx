import React, { useEffect } from "react";
import { addSourcesInOrder } from "../util/addSourcesInOrder";

const SourceCheckboxRaw = ({
  newExpenseAmount,
  newExpenseSources,
  setNewExpenseSources,
  envelopes,
  savings,
}) => {
  const fakeCurrency = "€";

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
          if (
            source.id === key ||
            (key === -1 && source.type === "short-term-savings") ||
            (key === -2 && source.type === "long-term-savings")
          ) {
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

  useEffect(() => {
    setNewExpenseSources((prevSources) => {
      // Reset the amount values in each source object
      const updatedSources = prevSources.map((source) => {
        return {
          ...source,
          amount: "", // Reset the amount for each source
        };
      });

      return updatedSources;
    });
  }, [newExpenseAmount, setNewExpenseSources]);

  const handleChoice = (event) => {
    const isChecked = event.target.checked;
    const checkboxId = event.target.id;
    if (isChecked) {
      if (!isNaN(parseFloat(checkboxId))) {
        const envelope = envelopes.find(
          (item) => item.id === Number(checkboxId),
        );
        setNewExpenseSources(
          addSourcesInOrder(newExpenseSources, {
            id: envelope.id,
            type: "envelope",
            name: envelope.name,
            amount: "",
            order: envelope.order,
          }),
        );
      } else if (checkboxId === "LTS") {
        setNewExpenseSources(
          addSourcesInOrder(newExpenseSources, {
            id: -2,
            type: "longTermSavings",
            name: "Long term savings",
            amount: "",
            order: -2,
          }),
        );
      } else if (checkboxId === "STS") {
        setNewExpenseSources(
          addSourcesInOrder(newExpenseSources, {
            id: -1,
            type: "shortTermSavings",
            name: "Short term savings",
            amount: "",
            order: -1,
          }),
        );
      }
    } else {
      if (!isNaN(parseFloat(checkboxId))) {
        const envelope = newExpenseSources.find(
          (item) => item.id === Number(checkboxId),
        );

        // Remove the envelope from newExpenseSources
        setNewExpenseSources((prevSources) =>
          prevSources.filter((source) => source.id !== envelope.id),
        );
      } else if (checkboxId === "LTS") {
        // Remove the long-term savings source
        setNewExpenseSources((prevSources) =>
          prevSources.filter((source) => source.type !== "longTermSavings"),
        );
      } else if (checkboxId === "STS") {
        // Remove the short-term savings source
        setNewExpenseSources((prevSources) =>
          prevSources.filter((source) => source.type !== "shortTermSavings"),
        );
      }
    }
  };

  return (
    <>
      <fieldset>
        <legend>Choose where to pay from:</legend>
        <div>
          <input
            type="checkbox"
            key={-1}
            id="STS"
            name="Short term savings"
            onChange={handleChoice}
            disabled={savings.shortTermSavings === 0}
          />
          <label htmlFor="STS">Short term savings</label>
        </div>
        <div>
          <input
            type="checkbox"
            key={-2}
            id="LTS"
            name="Long term savings"
            onChange={handleChoice}
            disabled={savings.longTermSavings === 0}
          />
          <label htmlFor="LTS">Long term savings</label>
        </div>
        {envelopes.map((envelope) => (
          <div key={envelope.id}>
            <input
              type="checkbox"
              id={envelope.id}
              name={envelope.name}
              onChange={handleChoice}
              disabled={envelope.currentAmount === 0}
            />
            <label htmlFor={envelope.id}>{envelope.name}</label>
          </div>
        ))}
        {/* NEW */}
        {newExpenseSources.map((source) => {
          let key = source.id; // Use source.id directly
          let name = source.name;

          return (
            <div key={key}>
              <label htmlFor={key}>Amount from {name}</label>
              <div className="form-item__input-with-currency">
                <span className="form-item__input-with-currency__currency">
                  {fakeCurrency}
                </span>
                <input
                  className="form-item__input-with-currency__input"
                  type="text"
                  value={source.amount || ""}
                  onChange={(e) => handleSourceAmountsChange(e, key)}
                  id={key}
                  name={key}
                />
              </div>
            </div>
          );
        })}
      </fieldset>
    </>
  );
};

export default SourceCheckboxRaw;
