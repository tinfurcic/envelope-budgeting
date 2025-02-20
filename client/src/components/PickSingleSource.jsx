import React, { useState, useEffect } from "react";
import PickSourceInCategory from "./PickSourceInCategory";
import PickCategory from "./PickCategory";

const PickSingleSource = ({
  newExpenseAmount,
  setNewExpenseSources,
  sourceCategory,
  setSourceCategory,
  envelopes,
  savings,
}) => {
  const fakeCurrency = "€";

  const [selectedSourceId, setSelectedSourceId] = useState("");
  const [potentialSources, setPotentialSources] = useState([]);

  const handleSelectedSourceChange = (event) => {
    const id = event.target.value;
    setSelectedSourceId(id);
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
          order,
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
    if (selectedSourceId !== "") {
      const id = selectedSourceId;
      const source = potentialSources.find((item) => item.id === Number(id));
      if (source.currentAmount < newExpenseAmount) {
        setSelectedSourceId("");
      }
    }
  }, [selectedSourceId, newExpenseAmount, potentialSources]);

  useEffect(() => {
    setNewExpenseSources((prev) => {
      if (prev && prev.length > 0) {
        return [{ ...prev[0], amount: newExpenseAmount }];
      }
      return prev;
    });
  }, [newExpenseAmount, setNewExpenseSources]);

  const handleCategoryChange = (value) => {
    setNewExpenseSources([]);
    setSourceCategory(value);
    setSelectedSourceId("");
  };

  return (
    <>
      <PickCategory
        sourceCategory={sourceCategory}
        handleCategoryChange={handleCategoryChange}
      />

      <PickSourceInCategory
        sourceCategory={sourceCategory}
        envelopes={envelopes}
        savings={savings}
        fakeCurrency={fakeCurrency}
        newExpenseAmount={newExpenseAmount}
        selectedSourceId={selectedSourceId}
        handleSelectedSourceChange={handleSelectedSourceChange}
      />
    </>
  );
};

export default PickSingleSource;
