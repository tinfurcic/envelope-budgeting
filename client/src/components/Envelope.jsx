import React from "react";
import { useParams, useOutletContext } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import backArrow from "../media/back-arrow.png";
import editIcon from "../media/edit-icon.png";

const Envelope = () => {
  const { id } = useParams();
  const { envelopes } = useOutletContext();
  const navigate = useNavigate();

  const envelope = envelopes.find((env) => env.id.toString() === id);

  if (!envelope) {
    return <span>Envelope not found.</span>;
  }

  return (
    <div className="envelope-overview">
      <div className="envelope-overview__nav-back">
        <Button
          type="button"
          className="button button--back"
          onClick={() => navigate("/envelopes")}
          isDisabled={false}
        >
          <img src={backArrow} alt="Back" width="20" /> to My Envelopes
        </Button>
      </div>
      <h1 className="envelope-overview__heading">
        {envelope.name}
        <div className="envelope-overview__heading__edit-icon">
          <Button
            type="button"
            className="button button--edit"
            onClick={null}
            isDisabled={false}
          >
            <img src={editIcon} alt="Edit Icon" />
          </Button>
        </div>
      </h1>
      <p className="envelope-overview__description">
        Envelope description here
      </p>
      <p>Budget: ${envelope.budget}</p>
      <p>Current Amount: ${envelope.currentAmount}</p>
      <div>
        {Object.entries(envelope).map(([key, value]) => (
          <p key={key}>{`${key}: ${value}`}</p>
        ))}
      </div>

      <h2 className="envelope-overview__this-month-expenses">
        This month's expenses
      </h2>
    </div>
  );
};

export default Envelope;
