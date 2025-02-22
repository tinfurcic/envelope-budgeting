import React, { useEffect, useState } from "react";
import { createGoal } from "../util/axios/createFunctions";
import { useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import Button from "./Button";

const CreateGoalPage = () => {
  const [newGoalName, setNewGoalName] = useState("");
  const [newGoalAmount, setNewGoalAmount] = useState("");
  const [newGoalDeadline, setNewGoalDeadline] = useState("");
  const [newGoalDescription, setNewGoalDescription] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);
  const [minDate, setMinDate] = useState("");

  const { date } = useOutletContext();
  const navigate = useNavigate();
  const fakeCurrency = "€";

  useEffect(() => {
    const dateObject = new Date(date);
    dateObject.setMonth(dateObject.getMonth() + 2);

    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, "0");
    const day = String(dateObject.getDate()).padStart(2, "0");

    const formattedMinDate = `${year}-${month}-${day}`;
    setMinDate(formattedMinDate);

    console.log("minDate changed");
  }, [date]);

  const handleCreateGoal = async (e) => {
    e.preventDefault();
    const result = await createGoal(
      newGoalName,
      Number(newGoalAmount),
      newGoalDeadline,
      0, // accumulated
      newGoalDescription,
    );

    if (!result.success) {
      // display error message
      console.error(result.error);
    } else {
      // display success message
      setNewGoalName("");
      setNewGoalAmount("");
      setNewGoalDeadline("");
      setNewGoalDescription("");
    }
  };

  const handleValueChange = (event, setValue) => {
    let value = event.target.value;
    value = value.replace(/,/g, ".");
    const regex = /^(|0|0\.|0\.\d{1,2}|[1-9]\d*(\.|\.\d{1,2})?)$/;
    if (regex.test(value)) {
      setValue(value);
    }
  };

  useEffect(() => {
    setIsDisabled(
      newGoalName === "" ||
        Number(newGoalAmount) === 0 ||
        newGoalDeadline === "",
    );
  }, [newGoalName, newGoalAmount, newGoalDeadline, setIsDisabled]);

  return (
    <div className="create-goal-page">
      <header className="create-goal-page__header">
        <div className="create-goal-page__nav-back">
          <Button
            type="button"
            className="button button--back"
            onClick={() => navigate("/goals")}
          >
            X
          </Button>
        </div>
        <h1 className="create-goal-page__heading">Set a New Goal</h1>
        <p className="create-goal-page__description">
          Want to accumulate a larger sum of money for a bigger expense? Set
          yourself a goal.
          {/* Here you can set a new goal to help you put aside a larger amount of money over a greater period of time. */}
        </p>
      </header>

      <main>
        <form
          onSubmit={handleCreateGoal}
          className="create-goal-page__form"
          autoComplete="off"
        >
          <div className="form-item">
            <label className="form-label" htmlFor="name">
              Goal name
            </label>
            <input
              className="form-input"
              type="text"
              value={newGoalName}
              onChange={(e) => setNewGoalName(e.target.value)}
              id="name"
              name="name"
              maxLength="30"
            />
          </div>

          <div className="form-item">
            <label className="form-label" htmlFor="budget">
              Goal amount
            </label>
            <div className="input-with-currency">
              <span className="input-with-currency__currency">
                {fakeCurrency}
              </span>
              <input
                className="form-input input-with-currency__input"
                type="text"
                value={newGoalAmount}
                onChange={(e) => handleValueChange(e, setNewGoalAmount)}
                id="budget"
                name="budget"
              />
            </div>
          </div>

          <div className="form-item">
            <label className="form-label" htmlFor="date">
              Goal deadline
            </label>
            <div className="form-item__date">
              <input
                className="form-item__date__input form-input"
                type="date"
                value={newGoalDeadline}
                onChange={(e) => setNewGoalDeadline(e.target.value)}
                id="date"
                name="date"
                min={minDate}
              />
            </div>
          </div>

          <div className="form-item">
            <label className="form-label" htmlFor="description">
              Description (optional)
            </label>
            <input
              className="form-input"
              type="text"
              value={newGoalDescription}
              onChange={(e) => setNewGoalDescription(e.target.value)}
              id="description"
              name="description"
            />
          </div>

          <div className="form-item__submit-btn">
            <Button
              type="submit"
              className="button button--green"
              isDisabled={isDisabled}
            >
              Set Goal
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreateGoalPage;
