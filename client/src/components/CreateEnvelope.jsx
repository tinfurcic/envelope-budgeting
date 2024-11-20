import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { createEnvelope } from "../util/createEnvelope";
import AmountField from "./AmountField";

const CreateEnvelope = () => {
  const { setEnvelopes } = useOutletContext();

  const [newEnvelopeName, setNewEnvelopeName] = useState("");
  const [newEnvelopeBudget, setNewEnvelopeBudget] = useState(0);
  const [newEnvelopeCurrentAmount, setNewEnvelopeCurrentAmount] = useState(0);

  const handleCreateEnvelope = async () => {
    const result = await createEnvelope(
      newEnvelopeName,
      newEnvelopeBudget,
      newEnvelopeCurrentAmount,
      setEnvelopes,
    );

    if (!result.success) {
      console.error(result.error);
    } else {
      // You may want to reset some values here.
    }
  };

  return (
    <div className="envelope-section">
      <h3>Create a New Envelope</h3>
      <label>Envelope name: </label>
      <input
        type="text"
        value={newEnvelopeName}
        onChange={(e) => setNewEnvelopeName(e.target.value)}
      />
      <AmountField
        label="Budget: "
        amount={newEnvelopeBudget}
        setAmount={setNewEnvelopeBudget}
        id={null}
        showSaveButton={false}
      />
      <AmountField
        label="Current amount: "
        amount={newEnvelopeCurrentAmount}
        setAmount={setNewEnvelopeCurrentAmount}
        id={null}
        showSaveButton={false}
      />
      <button onClick={handleCreateEnvelope}>Create Envelope</button>
    </div>
  );
};

export default CreateEnvelope;
