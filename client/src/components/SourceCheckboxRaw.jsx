import React, { useEffect } from "react";
import { addSourcesInOrder } from "../util/addSourcesInOrder";

const SourceCheckboxRaw = ({
  newExpenseAmount,
  newExpenseSources,
  sourceAmounts,
  setSourceAmounts,
  setNewExpenseSources,
  envelopes,
  savings,
}) => {
  const fakeCurrency = "€";

  // sum of all entered amounts
  const totalEnteredAmount = Object.values(sourceAmounts).reduce(
    (sum, val) => sum + (parseFloat(val) || 0),
    0
  );

  const handlesourceAmountsChange = (event, key) => {
    let value = event.target.value;
    value = value.replace(/,/g, ".");
    const regex = /^(|0|0\.|0\.\d{1,2}|[1-9]\d*(\.|\.\d{1,2})?)$/;
    if (regex.test(value)) {
      const numericValue = parseFloat(value) || 0;
      const otherValuesSum = totalEnteredAmount - (parseFloat(sourceAmounts[key]) || 0);

      if (numericValue + otherValuesSum > newExpenseAmount) {
        value = Math.max(newExpenseAmount - otherValuesSum, 0).toFixed(2).toString();
      }

      setSourceAmounts((prev) => ({
        ...prev,
        [key]: value,
      }));
    }
  };

  useEffect(() => {
    setSourceAmounts((prev) => {
      const resetAmounts = {};
      Object.keys(prev).forEach((key) => {
        resetAmounts[key] = "";
      });
      return resetAmounts;
    });
  }, [newExpenseAmount]); // probably best to rest all on main amount change

  const handleChoice = (event) => {
    const isChecked = event.target.checked;
    const id = event.target.id;
    if (isChecked) {
      if (!isNaN(parseFloat(id))) {
        const envelope = envelopes.find((item) => item.id === Number(id));
        setNewExpenseSources(addSourcesInOrder(newExpenseSources, envelope));
      } else if (id === "LTS") {
        setNewExpenseSources(
          addSourcesInOrder(newExpenseSources, {
            longTermSavings: savings.longTermSavings,
          }),
        );
      } else if (id === "STS") {
        setNewExpenseSources(
          addSourcesInOrder(newExpenseSources, {
            shortTermSavings: savings.shortTermSavings,
          }),
        );
      }
    } else {
      if (!isNaN(parseFloat(id)) && isFinite(id)) {
        const envelope = newExpenseSources.find(
          (item) => item.id === Number(id),
        );
        setNewExpenseSources((prevSources) =>
          prevSources.filter((source) => source.id !== envelope.id),
        );
        setSourceAmounts((prev) => {
          const newState = { ...prev };
          delete newState[id]; // Remove amount when source is deselected
          return newState;
        });
      } else if (id === "LTS") {
        setNewExpenseSources((prevSources) =>
          prevSources.filter(
            (source) => !Object.hasOwn(source, "longTermSavings"),
          ),
        );
        setSourceAmounts((prev) => {
          const newState = { ...prev };
          delete newState["-2"]; // Remove amount when source is deselected
          return newState;
        });
      } else if (id === "STS") {
        setNewExpenseSources((prevSources) =>
          prevSources.filter(
            (source) => !Object.hasOwn(source, "shortTermSavings"),
          ),
        );
        setSourceAmounts((prev) => {
          const newState = { ...prev };
          delete newState["-1"]; // Remove amount when source is deselected
          return newState;
        });
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
            key="-1"
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
            key="-2"
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
        {newExpenseSources.map((source) => {
          //const key = source.id || JSON.stringify(source);
          let key;
          let name;
          if (source.id) {
            key = source.id;
            name = source.name;
          } else if (Object.keys(source)[0] === "shortTermSavings") {
            key = -1;
            name = "Short term savings";
          } else {
            key = -2;
            name = "Long term savings";
          }
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
                  value={sourceAmounts[key] || ""}
                  onChange={(e) => handlesourceAmountsChange(e, key)}
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
