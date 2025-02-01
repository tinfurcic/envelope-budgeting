import React from "react";
import { useOutletContext } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import EnvelopeCard from "./EnvelopeCard";
import Button from "./Button";
import expenseIcon from "../media/expense.png";

const EnvelopesPage = () => {
  const { envelopes, loadingData } = useOutletContext();
  const navigate = useNavigate();

  return (
    <div className="envelopes-page">
      <div className="envelopes-page__header">
        <h2 className="envelopes-page__heading">My Envelopes</h2>
        <Button
          type="button"
          className="button"
          onClick={() => navigate("/create")}
          variant="blue"
          isDisabled={false}
        >
          New Envelope
        </Button>
      </div>

      {/* Add grid/slider view button*/}
      <div className="envelopes-page__envelopes">
        {loadingData ? (
          <span className="envelopes-page__loading-message">
            Loading your envelopes...
          </span>
        ) : envelopes.length === 0 ? (
          <div className="envelopes-page__no-items">
            <span className="envelopes-page__no-items-message">
              You don't have any envelopes yet. Create one!
            </span>
          </div>
        ) : (
          <div className="envelopes-page__cards-container">
            {envelopes.map((envelope) => (
              <EnvelopeCard key={envelope.id} envelope={envelope} />
            ))}
          </div>
        )}
      </div>
      <div className="new-expense-button">
        <Button
          type="button"
          className="button"
          onClick={() => navigate("/expense")}
          variant="new-expense"
          isDisabled={false}
        >
          <img src={expenseIcon} alt="New expense" />
        </Button>
      </div>
    </div>
  );
};

export default EnvelopesPage;
