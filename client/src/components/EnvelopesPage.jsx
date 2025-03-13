import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import { batchDeleteAndReorderEnvelopes } from "../util/axios/updateFunctions";
import { arraysAreEqual } from "../util/arraysAreEqual";
import useScreenSize from "../hooks/useScreenSize";
import useOverlapping from "../hooks/useOverlapping";
import expenseIcon from "../media/expense.png";
import EnvelopeCard from "./EnvelopeCard";
import Button from "./Button";
import SvgGear from "./svg-icons/SvgGear";

const EnvelopesPage = () => {
  const { envelopes, loadingEnvelopes, syncingEnvelopes } = useOutletContext();
  const { isSmall } = useScreenSize();
  const navigate = useNavigate();

  const isButtonOverlapping = useOverlapping(
    ".envelopes-page",
    ".new-expense-button",
    [".envelope-card"],
    500,
    [envelopes],
  );

  const [isManageMode, setIsManageMode] = useState(false);
  const [toDelete, setToDelete] = useState([]); // Tracks envelopes marked for deletion
  const [reorderedEnvelopes, setReorderedEnvelopes] = useState([...envelopes]); // Tracks reordering changes
  const reorderedIds = reorderedEnvelopes
    .map((env) => env.id)
    .filter((envId) => !toDelete.includes(envId));

  const changesAreMade =
    isManageMode &&
    (!arraysAreEqual(envelopes, reorderedEnvelopes) || toDelete.length !== 0);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await batchDeleteAndReorderEnvelopes(
        toDelete,
        reorderedIds,
      );
      if (!response.success) {
        throw new Error("Failed to save changes.");
      }
      setToDelete([]);
      console.log("Changes saved successfully!");
    } catch (error) {
      console.error("Error saving changes:", error.message);
    }
  };

  useEffect(() => {
    // saving actually lasts considerably shorter, but this simplifies conditional rendering
    setIsSaving(false);
    setIsManageMode(false);
  }, [envelopes]);

  const toggleManageMode = () => {
    setIsManageMode(!isManageMode);
    setReorderedEnvelopes([...envelopes]);
  };

  // disable scrolling on touchmove events (only drag&drop)
  useEffect(() => {
    const disableScroll = (e) => e.preventDefault();

    if (isManageMode) {
      document.addEventListener("touchmove", disableScroll, { passive: false });
    } else {
      document.removeEventListener("touchmove", disableScroll);
    }

    return () => {
      document.removeEventListener("touchmove", disableScroll);
    };
  }, [isManageMode]);

  const handleDragStart = () => {
    document.body.style.overflow = "hidden"; // Prevent scrolling
    document.body.style.touchAction = "none"; // Prevent gestures
  };

  const handleDragEnd = (event) => {
    document.body.style.overflow = ""; // Restore scrolling
    document.body.style.touchAction = "";

    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setReorderedEnvelopes((prevOrder) => {
      const oldIndex = prevOrder.findIndex((env) => env.id === active.id);
      const newIndex = prevOrder.findIndex((env) => env.id === over.id);
      return arrayMove(prevOrder, oldIndex, newIndex);
    });
  };

  return (
    <div className="envelopes-page">
      <header className="envelopes-page__header">
        <h1 className="envelopes-page__heading">My Envelopes</h1>
        <Button
          className="button button--blue"
          onClick={() => navigate("/create-envelope")}
        >
          New Envelope
        </Button>
      </header>
      <div className="manage-envelopes">
        <Button className="button button--blue" onClick={toggleManageMode}>
          {/* On click, show a "Drag&drop to reorder!" popup with a "Don't show again" checkbox */}
          <div className="button__gear-icon">
            <SvgGear
              fillColor="black"
              isActive={isManageMode}
              isSaving={isSaving}
            />
          </div>
          Manage envelopes
        </Button>
        {changesAreMade && (
          <>
            {isSaving ? (
              <p className="manage-envelopes__saving-message">Saving...</p>
            ) : (
              <Button
                className="button button--green"
                onClick={isSaving ? null : handleSave}
              >
                Save changes
              </Button>
            )}
          </>
        )}
      </div>

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
        ) : isManageMode ? (
          <DndContext
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToParentElement]}
          >
            <SortableContext items={reorderedEnvelopes.map((env) => env.id)}>
              <div className="envelopes-page__cards-container">
                {reorderedEnvelopes.map((envelope) => (
                  <EnvelopeCard
                    key={envelope.id}
                    envelope={envelope}
                    isManageMode={isManageMode}
                    isSaving={isSaving}
                    toDelete={toDelete}
                    setToDelete={setToDelete}
                    loadingEnvelopes={loadingEnvelopes}
                    syncingEnvelopes={syncingEnvelopes}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          <div className="envelopes-page__cards-container">
            {envelopes.map((envelope) => (
              <EnvelopeCard
                key={envelope.id}
                envelope={envelope}
                isManageMode={isManageMode}
              />
            ))}
          </div>
        )}
      </div>

      <div
        className={`new-expense-button ${isButtonOverlapping ? "overlapping" : ""} ${isSmall ? "large-margin" : "small-margin"}`}
      >
        <Button
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
