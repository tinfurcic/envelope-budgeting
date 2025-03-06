import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Button from "./Button";
import SvgDeleteIcon from "../components/SvgDeleteIcon";

const EnvelopeCard = ({ envelope, isManageMode, toDelete, setToDelete }) => {
  const envelopeRef = useRef(null);
  const navigate = useNavigate();
  const fakeCurrency = "€";

  const markedForDeletion = toDelete?.includes(envelope.id);

  const toggleDelete = () => {
    setToDelete((prev) =>
      prev.includes(envelope.id)
        ? prev.filter((envId) => envId !== envelope.id)
        : [...prev, envelope.id],
    );
  };

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: envelope.id });

  useEffect(() => {
    const updateFontSize = () => {
      if (envelopeRef.current) {
        const { height } = envelopeRef.current.getBoundingClientRect();
        envelopeRef.current.style.setProperty(
          "--font-size",
          `${height * 0.015}rem`,
        );
      }
    };

    window.addEventListener("resize", updateFontSize);
    updateFontSize(); // Initial calculation

    return () => window.removeEventListener("resize", updateFontSize);
  }, [envelope]); // ✅ Runs whenever envelope changes (important for DnD updates!)

  return (
    <div
      className="envelope-card-wrapper"
      ref={setNodeRef} // ✅ Directly use setNodeRef here (no need for useCallback)
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      onClick={
        isManageMode ? undefined : () => navigate(`/envelopes/${envelope.id}`)
      }
      {...(isManageMode ? attributes : {})}
      {...(isManageMode
        ? {
            ...listeners,
            onPointerDown: (e) => {
              if (e.target.closest("[data-no-dnd]")) return;
              listeners.onPointerDown?.(e);
            },
          }
        : {})}
    >
      {isManageMode && (
        <div className="envelope-card-wrapper__corner-button" data-no-dnd>
          <Button
            className="button button--envelope-corner"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              toggleDelete();
            }}
          >
            {markedForDeletion ? (
              <SvgDeleteIcon fillColor="lightblue" strokeColor="black" />
            ) : (
              <SvgDeleteIcon fillColor="red" strokeColor="black" />
            )}
          </Button>
        </div>
      )}

      <div
        className="envelope-card"
        ref={envelopeRef} // ✅ Separate from setNodeRef
        style={{
          backgroundColor: envelope.color,
          opacity: markedForDeletion ? 0.5 : 1,
        }}
      >
        <div className="envelope-card__name">
          <div className="ellipsis-wrapper">{envelope.name}</div>
        </div>
        <div className="envelope-card__amount">
          {fakeCurrency}
          {envelope.currentAmount}
        </div>
      </div>
    </div>
  );
};

export default EnvelopeCard;
