import React from "react";
import { useOutletContext } from "react-router-dom";
import EnvelopeCard from "./EnvelopeCard";
import { fetchEnvelopes } from "../util/axios/fetchEnvelopes";

const EnvelopesPage = () => {
  const { envelopes, loadingEnvelopes } = useOutletContext();

  return (
    <>
      <h2>My Envelopes</h2>
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
              fetchEnvelopes={fetchEnvelopes}
            />
          ))
        )}
      </div>
    </>
  );
};

export default EnvelopesPage;
