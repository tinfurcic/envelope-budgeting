import React, { useState, useEffect, Fragment } from "react";
import { addSourcesInOrder } from "../util/addSourcesInOrder";

const SourceCheckboxRaw = ({
  newExpenseAmount,
  newExpenseSources,
  setNewExpenseSources,
  envelopes,
  savings
}) => {
  const fakeCurrency = "€";

  const [potentialSources, setPotentialSources] = useState([]);

  useEffect(() => {
    setPotentialSources([...envelopes, ...Object.values(savings)]);
  }, [envelopes, savings]);


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

  const handleChoice = (event) => {
    const isChecked = event.target.checked;
    const checkboxId = event.target.id;
    if (isChecked) {
      const source = potentialSources.find(
        (item) => item.id === Number(checkboxId),
      );
      let type, order, name;
      if (source.id > 0) {
        [type, order, name] = ["envelope", source.order, source.name];
      } else if (source.id === -1) {
        [type, order, name] = ["shortTermSavings", -1, "Short term savings"];
      } else if (source.id === -2) {
        [type, order, name] = ["longTermSavings", -2, "Long term savings"];
      }
      setNewExpenseSources(
        addSourcesInOrder(newExpenseSources, {
          id: source.id,
          type,
          name,
          amount: "",
          order
        }),
      );
    } else {
      if (!isNaN(parseFloat(checkboxId))) {
        const sourceToRemove = newExpenseSources.find(
          (item) => item.id === Number(checkboxId),
        );

        setNewExpenseSources((prevSources) =>
          prevSources.filter((source) => source.id !== sourceToRemove.id)
        );
      } else {
        throw new Error("Unexpected checkbox id!")
      }
    }
  };

  // when newExpenseAmount changes, reset all amount fields
  useEffect(() => { 
    setNewExpenseSources((prevSources) => {
      const updatedSources = prevSources.map((source) => {
        return {
          ...source,
          amount: "",
        };
      });

      return updatedSources;
    });
  }, [newExpenseAmount, setNewExpenseSources]);

  // Set maximum input value to match the amount in the source
  useEffect(() => {
    for (const expenseSource of newExpenseSources) {
      const id = expenseSource.id;
      const source = potentialSources.find((item) => item.id === Number(id));
      if (source && expenseSource.amount > source.currentAmount) {
        setNewExpenseSources((prev) => 
          prev.map((expenseSource) =>
            expenseSource.id === id ? { ...expenseSource, amount: source.currentAmount } : expenseSource
          )
        ); 
      } 
    }
  }, [newExpenseSources, potentialSources]);

  return (
    <>
      <fieldset>
        <legend>Choose where to pay from:</legend>
        {potentialSources.map((source) => (
          <Fragment key={source.id}>
            <input
              type="checkbox"
              id={source.id} // source.id
              name={source.id > 0 ? source.name : source.id === -1 ? "Short term savings" : source.id === -2 ? "Long term savings" : "¿NONAME?"} 
              onChange={handleChoice}
              disabled={source.currentAmount === 0}
            />
            <label htmlFor={source.id}>{source.id > 0 ? source.name : source.id === -1 ? "Short term savings" : source.id === -2 ? "Long term savings" : "¿NONAME?"}</label>
          </Fragment>
        ))}
        {newExpenseSources.map((source) => {
          let key = source.id;
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
