import React from "react";
import { useOutletContext } from "react-router-dom";
import EnvelopeCard from "./EnvelopeCard";
import Button from "./Button";

const EnvelopesPage = () => {
  const { envelopes, loadingEnvelopes } = useOutletContext();

  return (
    <div className="envelopes-page">
      <div className="envelopes-page__header">
        <h2 className="envelopes-page__header__heading" >My Envelopes</h2>
        <Button type="button" className="button" navigateTo ="/create" variant="blue" isDisabled={false} > 
          New Envelope
        </Button>
      </div>
      
      {/* Add grid/slider view button*/}
      <div className="envelopes">
        {loadingEnvelopes ? (
          <span>Loading your envelopes...</span>
        ) : envelopes.length === 0 ? (
          <>
            <span>You don't have any envelopes yet. </span>
            <button>Create one!</button>
          </>
        ) : (
          envelopes.map((envelope) => (
            <EnvelopeCard
              key={envelope.id}
              envelope={envelope}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default EnvelopesPage;