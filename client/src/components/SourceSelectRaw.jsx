import React, { useState, useEffect, Fragment } from "react";

const SourceSelectRaw = ({
  newExpenseAmount,
  setNewExpenseSources,
  sourceCategory,
  setSourceCategory,
  envelopes,
  savings,
}) => {
  const fakeCurrency = "€";

  const [selectedOption, setSelectedOption] = useState("");
  const [potentialSources, setPotentialSources] = useState([]);

  const handleSelectedSourceChange = (event) => {
    const id = event.target.value;
    setSelectedOption(id);
    if (id === "") {
      setNewExpenseSources([]);
    } else if (!isNaN(parseFloat(id)) && isFinite(id)) {
      const source = potentialSources.find((item) => item.id === Number(id));
      let type, order, name;
      if (source.id > 0) {
        [type, order, name] = ["envelope", source.order, source.name];
      } else if (source.id === -1) {
        [type, order, name] = ["shortTermSavings", -1, "Short term savings"];
      } else if (source.id === -2) {
        [type, order, name] = ["longTermSavings", -2, "Long term savings"];
      }
      setNewExpenseSources([
        {
          id: source.id, 
          type,
          name, 
          amount: newExpenseAmount,
          order
        },
      ]);
    } else {
      throw new Error("Option id type not recognized!");
    }
  };

  useEffect(() => {
    setPotentialSources([...envelopes, ...Object.values(savings)]);
  }, [envelopes, savings]);

  useEffect(() => {
    if (selectedOption !== "") {
      const id = selectedOption;
      const source = potentialSources.find((item) => item.id === Number(id));
      if (source.currentAmount < newExpenseAmount) {
        setSelectedOption("");
      }
    }
  }, [selectedOption, newExpenseAmount]);

  useEffect(() => {
    setNewExpenseSources((prev) => {
      if (prev && prev.length > 0) {
        return [{ ...prev[0], amount: newExpenseAmount }];
      }
      return prev;
    });
  }, [newExpenseAmount]);

  return (
    <>
      <fieldset>
        <legend>Source</legend>
        {["envelope", "savings"].map((value) => (
        <Fragment key={value}>
          <input
            type="radio"
            value={value}
            id={value}
            name="source-category"
            checked={sourceCategory === value}
            onChange={() => {
              setNewExpenseSources([]);
              setSourceCategory(value);
              setSelectedOption("");
            }}
          />
          <label htmlFor={value}>
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </label>
        </Fragment>
    ))}
      </fieldset>

      {sourceCategory !== null && (
        <div>
          <label htmlFor="source-select__label"></label>
          <select
            name="envelope-select"
            id="envelope-select"
            onChange={handleSelectedSourceChange}
            value={selectedOption}
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
                    disabled={envelope.currentAmount < newExpenseAmount || envelope.currentAmount === 0} // disabled if currentAmount is less than newExpenseAmount
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
                    value={-1} //?
                    disabled={savings.shortTermSavings.currentAmount < newExpenseAmount || savings.shortTermSavings.currentAmount === 0}
                  >
                    Short term savings ({fakeCurrency}
                    {savings.shortTermSavings.currentAmount} left)
                  </option>
                  <option
                    value={-2}
                    disabled={savings.longTermSavings.currentAmount < newExpenseAmount || savings.longTermSavings.currentAmount === 0}
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
    </>
  );
};

export default SourceSelectRaw;
