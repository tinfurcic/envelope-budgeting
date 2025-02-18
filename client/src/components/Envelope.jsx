import React, { useState, useEffect } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import editIcon from "../media/edit-icon.png";

import ProgressBar from "./ProgressBar";
import ExpensesTable from "./ExpensesTable";
import Button from "./Button";
import Colors from "./Colors";

const Envelope = () => {
  const { id } = useParams();
  const { envelopes, expenses, loadingExpenses, syncingExpenses } =
    useOutletContext();
  const navigate = useNavigate();

  const envelope = envelopes.find((env) => env.id.toString() === id);

  const [latestExpenses, setLatestExpenses] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editableName, setEditableName] = useState(null);
  const [editableDescription, setEditableDescription] = useState(null);
  const [editableColor, setEditableColor] = useState(null);

  useEffect(() => {
    if (envelope && expenses) {
      setLatestExpenses(
        expenses.filter((expense) =>
          expense.sources.some((source) => source.id === envelope.id),
        ),
      );
    }
  }, [expenses, envelope]);

  useEffect(() => {
    if (envelope) {
      setEditableName(envelope.name);
      setEditableDescription(envelope.description);
      setEditableColor(envelope.color);
    }
  }, [envelope]);

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    if (!isEditMode) {
      setIsEditMode(true);
    } else {
      handleSave();
    }
  };

  const handleNameChange = (e) => {
    setEditableName(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setEditableDescription(e.target.value);
  };

  const handleColorChange = (e) => {
    setEditableColor(e.target.value);
  }

  const handleSave = () => {
    // handle saving name, update and description
    setIsEditMode(false); // Toggle off edit mode after saving
  };

  if (!envelope) {
    return (
      <>
        <p>Envelope not found.</p>
        <p>Ah.</p>
        <p>If only this was a proper error page with some navigation...</p>
      </>
    );
  }

  return (
    <div className="envelope-overview">
      <header
        className="envelope-overview__header"
        style={{ "--envelope-color": envelope.color }}
      >
        <button
          type="button"
          className="envelope-overview__back-button"
          onClick={() => navigate("/envelopes")}
        >
          X
        </button>

        {/* Toggle between view and edit mode */}
        {isEditMode ? (
          <input
            type="text"
            className="envelope-overview__name-input"
            value={editableName}
            onChange={handleNameChange}
          />
        ) : (
          <h1 className="envelope-overview__name">{editableName}</h1>
        )}

        {isEditMode ? (
          <textarea
            className="envelope-overview__description-input"
            value={editableDescription}
            onChange={handleDescriptionChange}
          />
        ) : (
          <p className="envelope-overview__description">
            {editableDescription || "No description"}
          </p>
        )}

        {isEditMode ? (
          <div className="envelope-overview__color-input">
            <Colors
              newEnvelopeColor={editableColor}
              setNewEnvelopeColor={setEditableColor}
              currentColor={envelope.color}
            />
          </div>
        ) : null}

        <div className="envelope-overview__header-edit">
          <Button
            type="button"
            className="button button--edit"
            onClick={toggleEditMode} // Toggle the edit mode on button click
          >
            <img src={editIcon} alt="Edit Icon" />
          </Button>
        </div>
      
      </header>
      <main>
        <div className="envelope-overview__overview">
          <h2 className="envelope-overview__subheading">Budget overview</h2>
          <ProgressBar
            budget={envelope.budget}
            amount={envelope.currentAmount}
          />
        </div>
        <div className="envelope-overview__latest-expenses">
          <h2 className="envelope-overview__subheading">Latest expenses</h2>
          {loadingExpenses || latestExpenses === null ? (
            <p>Loading expenses...</p>
          ) : syncingExpenses ? (
            <p>Syncing expenses...</p>
          ) : latestExpenses.length === 0 ? (
            <p>No expenses this month.</p>
          ) : (
            <ExpensesTable
              dateWindow="latest"
              expenses={latestExpenses}
              envelope={envelope}
            />
          )}
        </div>

        <h2 className="envelope-overview__subheading">This month's expenses</h2>
      </main>
    </div>
  );
};

export default Envelope;
