import React from "react";

const SourceSelectRaw = ({
  newExpenseAmount,
  setNewExpenseSources,
  sourceCategory,
  setSourceCategory,
  envelopes,
  savings,
}) => {
  const fakeCurrency = "€";

  const handleSelectedSourceChange = (event) => {
    const id = event.target.value;
    if (id === "") {
      setNewExpenseSources([]);
    } else if (!isNaN(parseFloat(id)) && isFinite(id)) {
      const envelope = envelopes.find((item) => item.id === Number(id));
      setNewExpenseSources([
        {
          id: envelope.id,
          type: "envelope",
          name: envelope.name,
          amount: newExpenseAmount,
          order: envelope.order,
        },
      ]);
    } else if (id === "LTS") {
      setNewExpenseSources([
        {
          id: -2,
          type: "longTermSavings",
          name: "Long term savings",
          amount: newExpenseAmount,
          order: -2,
        },
      ]);
    } else if (id === "STS") {
      setNewExpenseSources([
        {
          id: -1,
          type: "shortTermSavings",
          name: "Short term savings",
          amount: newExpenseAmount,
          order: -1,
        },
      ]);
    } else {
      console.error("Option id type not recognized");
    }
  };

  return (
    <>
      <fieldset>
        <legend>Source</legend>
        <input
          type="radio"
          value="envelope"
          id="envelope"
          name="source-category"
          checked={sourceCategory === "envelope"}
          onChange={() => {
            setNewExpenseSources([]);
            setSourceCategory("envelope");
          }}
        />
        <label htmlFor="envelope">Envelope</label>
        <input
          type="radio"
          value="savings"
          id="savings"
          name="source-category"
          checked={sourceCategory === "savings"}
          onChange={() => {
            setNewExpenseSources([]);
            setSourceCategory("savings");
          }}
        />
        <label htmlFor="savings">Savings</label>
      </fieldset>

      {sourceCategory !== null && (
        <div>
          <label htmlFor="source-select__label"></label>
          <select
            name="envelope-select"
            id="envelope-select"
            onChange={handleSelectedSourceChange}
          >
            {envelopes.length === 0 && sourceCategory === "envelope" ? (
              <option value="">No envelopes to select from.</option>
            ) : sourceCategory === "envelope" ? (
              <>
                <option key={-1} value="">
                  Select an envelope
                </option>
                {envelopes.map((envelope) => (
                  <option
                    key={envelope.id}
                    value={envelope.id}
                    disabled={envelope.currentAmount === 0}
                  >
                    {envelope.name} ({fakeCurrency}
                    {envelope.currentAmount} left)
                  </option>
                ))}
              </>
            ) : (
              sourceCategory === "savings" && (
                <>
                  <option value="no-selection">Select savings type</option>
                  <option
                    value="STS" //?
                    disabled={savings.shortTermSavings < newExpenseAmount}
                  >
                    Short term savings ({fakeCurrency}
                    {savings.shortTermSavings} left)
                  </option>
                  <option
                    value="LTS"
                    disabled={savings.longTermSavings < newExpenseAmount}
                  >
                    Long term savings ({fakeCurrency}
                    {savings.longTermSavings} left)
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
