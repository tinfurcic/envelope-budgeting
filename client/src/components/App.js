import React, { useState, useEffect } from "react";
import axios from "axios";
import Envelope from "./Envelope";
import { fetchEnvelopes } from "../util/fetchEnvelopes";
import { fetchTotalBudget } from "../util/fetchTotalBudget";
import AmountField from "./AmountField";
import CreateEnvelope from "./CreateEnvelope";

const App = () => {
  const [totalBudget, setTotalBudget] = useState(0);
  const [envelopes, setEnvelopes] = useState([]);
  const [newEnvelopeName, setNewEnvelopeName] = useState("");
  const [newEnvelopeBudget, setNewEnvelopeBudget] = useState(0);
  const [newEnvelopeCurrentAmount, setNewEnvelopeCurrentAmount] = useState(0);

  // Fetch data on load
  useEffect(() => {
    const loadStuff = async () => {
      try {
        const fetchedEnvelopes = await fetchEnvelopes();
        setEnvelopes(fetchedEnvelopes);
        console.log(fetchedEnvelopes);
        const fetchedTotalBudget = await fetchTotalBudget();
        setTotalBudget(fetchedTotalBudget);
      } catch (error) {
        console.error("Unable to load stuff properly.", error);
      }
    };
    loadStuff();
  }, []);

  const handleTransfer = async (
    givingEnvelopeId,
    receivingEnvelopeId,
    amount,
  ) => {
    try {
      await axios.post(
        `http://localhost:4001/api/envelopes/transfer/${givingEnvelopeId}/${receivingEnvelopeId}/${amount}`,
      );
      fetchEnvelopes(); // Refresh envelopes after transfer
    } catch (err) {
      console.error("handleTransfer() error: " + err);
    }
  };

  return (
    <div className="app-container">
      <h1>Envelope Budgeting App</h1>
      <div className="total-budget-section">
        <AmountField
          label="Total Budget: "
          amount={totalBudget}
          setAmount={setTotalBudget}
          id={-1}
          showSaveButton={true}
        />
      </div>
      <CreateEnvelope
        newEnvelopeName={newEnvelopeName}
        setNewEnvelopeName={setNewEnvelopeName}
        newEnvelopeBudget={newEnvelopeBudget}
        setNewEnvelopeBudget={setNewEnvelopeBudget}
        newEnvelopeCurrentAmount={newEnvelopeCurrentAmount}
        setNewEnvelopeCurrentAmount={setNewEnvelopeCurrentAmount}
        setEnvelopes={setEnvelopes}
      />

      <div className="envelopes-list">
        <h3>Envelopes</h3>
        {envelopes.map((envelope) => (
          <Envelope
            key={envelope.id}
            envelope={envelope}
            fetchEnvelopes={fetchEnvelopes}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
