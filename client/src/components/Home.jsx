import React from "react";
import { useOutletContext } from "react-router-dom";
import Envelope from "./Envelope";
import { fetchEnvelopes } from "../util/fetchEnvelopes";

const Home = () => {
  const { envelopes } = useOutletContext();

  return (
    <>
      <h2>My Envelopes</h2>
      {/* Add grid/slider view button*/}
      <div className="envelopes">
        {envelopes.length === 0 ? (
          <>
            <span>You don't have any envelopes yet. </span>
            <button>Create one!</button>
          </>
        ) : (
          envelopes.map((envelope) => (
            <Envelope
              key={envelope.id}
              envelope={envelope}
              fetchEnvelopes={fetchEnvelopes}
            />
          ))
        )}
      </div>
      <div className="transactions-section">
        <h2>Recent transactions</h2>
        {/* Show saved transactions, from newest to oldest */}
      </div>
    </>
  );
};

export default Home;
