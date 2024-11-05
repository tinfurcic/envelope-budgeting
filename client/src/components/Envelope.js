import React, { useState } from "react";
import axios from "axios";

const Envelope = ({ envelope, fetchEnvelopes }) => {
  const [editingName, setEditingName] = useState(false);
  const [editingBudget, setEditingBudget] = useState(false);
  const [name, setName] = useState(envelope.name);
  const [budget, setBudget] = useState(envelope.budget);
  const [currentAmount, setCurrentAmount] = useState(envelope.currentAmount);
  const [subtractAmount, setSubtractAmount] = useState(0);

  const handleUpdate = async (name, budget, currentAmount) => {
    try {
      await axios.post(
        `http://localhost:4001/api/envelopes/${Number(envelope.id)}`,
        {
          name,
          budget,
          currentAmount,
        },
      );
      await fetchEnvelopes();
      setName(envelope.name);
      setBudget(envelope.budget);
      setCurrentAmount(envelope.currentAmount);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="envelope">
      <div className="envelope-header">
        {" "}
        {/* this is fine */}
        {editingName ? (
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => {
              handleUpdate(name, null, null);
              setEditingName(false);
            }}
            autoFocus
          />
        ) : (
          <h4 onClick={() => setEditingName(true)}>{name}</h4>
        )}
        {editingBudget ? (
          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            onBlur={() => {
              handleUpdate(null, budget, null);
              setEditingBudget(false);
            }}
            autoFocus
          />
        ) : (
          <h4 onClick={() => setEditingBudget(true)}>
            (${envelope.budget}/mo.){" "}
            {/* This isn't working as intended, but the whole thing will be changed later anyways*/}
          </h4>
        )}
        {/* Style: This needs to be in the same line as the envelope name */}
      </div>

      <div className="envelope-budget">
        <input
          type="number"
          value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
        />
        <button onClick={() => handleUpdate(null, budget, null)}>
          Change Budget
        </button>
      </div>

      <div className="subtract-section">
        <input
          type="number"
          placeholder="Amount to subtract"
          value={subtractAmount}
          onChange={(e) => setSubtractAmount(Number(e.target.value))}
        />
        <button
          onClick={() =>
            handleUpdate(null, null, envelope.budget - subtractAmount)
          }
        >
          Subtract
        </button>
      </div>
    </div>
  );
};

export default Envelope;
