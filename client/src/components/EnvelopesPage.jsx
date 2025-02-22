import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { debounce } from "../util/debounce";
import useScreenSize from "../hooks/useScreenSize";
import expenseIcon from "../media/expense.png";
import EnvelopeCard from "./EnvelopeCard";
import Button from "./Button";

const EnvelopesPage = () => {
  const { envelopes, loadingEnvelopes, syncingEnvelopes } = useOutletContext();
  const { isSmall } = useScreenSize();
  const navigate = useNavigate();

  const [isButtonOverlapping, setIsButtonOverlapping] = useState(false);

  useEffect(() => {
    const envelopesPage = document.querySelector(".envelopes-page");
    const button = document.querySelector(".new-expense-button");
    const envelopeCards = document.querySelectorAll(".envelope-card");

    const checkOverlap = () => {
      const buttonRect = button.getBoundingClientRect();

      let overlapDetected = false;
      envelopeCards.forEach((card) => {
        const cardRect = card.getBoundingClientRect();

        if (
          buttonRect.top < cardRect.bottom &&
          buttonRect.bottom > cardRect.top &&
          buttonRect.left < cardRect.right &&
          buttonRect.right > cardRect.left
        ) {
          overlapDetected = true;
        }
      });

      setIsButtonOverlapping(overlapDetected);
    };

    const debouncedCheckOverlap = debounce(checkOverlap, 500);

    envelopesPage.addEventListener("scroll", debouncedCheckOverlap);
    window.addEventListener("resize", debouncedCheckOverlap);

    // Initial check
    debouncedCheckOverlap();

    return () => {
      envelopesPage.removeEventListener("scroll", debouncedCheckOverlap);
      window.removeEventListener("resize", debouncedCheckOverlap);
    };
  }, [envelopes]);

  return (
    <div className="envelopes-page">
      <div className="envelopes-page__header">
        <h1 className="envelopes-page__heading">My Envelopes</h1>
        <Button
          type="button"
          className="button button--blue"
          onClick={() => navigate("/create-envelope")}
        >
          New Envelope
        </Button>
      </div>

      {/* Add grid/slider view button */}
      <div className="envelopes-page__envelopes">
        {loadingEnvelopes ? (
          <span className="envelopes-page__loading-message">
            Loading your envelopes...
          </span>
        ) : syncingEnvelopes ? (
          <span className="envelopes-page__loading-message">
            Syncing your envelopes...
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

      <div
        className={`new-expense-button ${isButtonOverlapping ? "overlapping" : ""} ${isSmall ? "large-margin" : "small-margin"}`}
      >
        <Button
          type="button"
          className={`button button--new-expense`}
          onClick={() => navigate("/expense")}
        >
          <img src={expenseIcon} alt="New expense" />
        </Button>
      </div>
    </div>
  );
};

export default EnvelopesPage;
