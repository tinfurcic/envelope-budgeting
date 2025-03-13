import React, { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { createEnvelope } from "../util/axios/createFunctions";
import Button from "./Button";
import Colors from "./Colors";

const CreateEnvelopePage = () => {
  const navigate = useNavigate();

  const { income, savings, budgetSum } = useOutletContext();

  const [newEnvelopeName, setNewEnvelopeName] = useState("");
  const [newEnvelopeBudget, setNewEnvelopeBudget] = useState("");
  const [newEnvelopeCurrentAmount, setNewEnvelopeCurrentAmount] = useState("");
  const [newEnvelopeDescription, setNewEnvelopeDescription] = useState("");
  const [newEnvelopeColor, setNewEnvelopeColor] = useState("#FFFFFF");
  const [isChecked, setIsChecked] = useState(true);
  const [isDisabled, setIsDisabled] = useState(true);

  const fakeCurrency = "€";

  const handleCreateEnvelope = async (e) => {
    e.preventDefault();
    const result = await createEnvelope(
      newEnvelopeName,
      Number(newEnvelopeBudget),
      Number(newEnvelopeCurrentAmount),
      newEnvelopeDescription,
      newEnvelopeColor,
    );

    if (!result.success) {
      // display error message
      console.error(result.error);
    } else {
      // display success message
      console.log("Envelope successfully created!");
      setNewEnvelopeName("");
      setNewEnvelopeBudget("");
      setNewEnvelopeCurrentAmount("");
      setNewEnvelopeDescription("");
      setNewEnvelopeColor("#FFFFFF");
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

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
    if (!event.target.checked) {
      setNewEnvelopeCurrentAmount("");
    }
  };

  useEffect(() => {
    if (isChecked) {
      setNewEnvelopeCurrentAmount(newEnvelopeBudget);
    }
  }, [isChecked, newEnvelopeBudget]);

  useEffect(() => {
    if (Number(newEnvelopeBudget) < Number(newEnvelopeCurrentAmount)) {
      setNewEnvelopeCurrentAmount(
        Number(newEnvelopeBudget).toFixed(2).toString(),
      );
    }
  }, [newEnvelopeBudget, newEnvelopeCurrentAmount]);

  useEffect(() => {
    if (
      savings?.shortTermSavings?.currentAmount &&
      savings?.longTermSavings?.currentAmount
    ) {
      if (
        Number(newEnvelopeCurrentAmount) >
        savings.shortTermSavings.currentAmount
      ) {
        console.log("This action will draw funds from your long-term savings!");
        if (
          Number(newEnvelopeCurrentAmount) >
          savings.longTermSavings.currentAmount +
            savings.longTermSavings.currentAmount
        ) {
          setIsChecked(false);
          setNewEnvelopeCurrentAmount(
            savings.shortTermSavings.currentAmount +
              savings.longTermSavings.currentAmount,
          );
        }
      }
    }
  }, [savings, newEnvelopeCurrentAmount, setNewEnvelopeCurrentAmount]);

  useEffect(() => {
    if (income?.regularIncome?.value && budgetSum !== undefined) {
      const availableBudget = income.regularIncome.value - budgetSum;
      if (parseFloat(newEnvelopeBudget) > availableBudget) {
        setNewEnvelopeBudget(availableBudget.toFixed(2).toString());
        // and display a "Total assigned budget can't exceed regular income!" message
      }
    }
  }, [income, newEnvelopeBudget, budgetSum]);

  useEffect(() => {
    setIsDisabled(
      newEnvelopeName === "" ||
        newEnvelopeBudget === "" ||
        newEnvelopeBudget === "0" ||
        newEnvelopeCurrentAmount === "",
    );
  }, [newEnvelopeName, newEnvelopeBudget, newEnvelopeCurrentAmount]);

  return (
    <div className="create-envelope-page">
      <header className="create-envelope-page__header">
        <div className="create-envelope-page__nav-back">
          <Button
            className="button button--back"
            onClick={() => navigate("/envelopes")}
          >
            X
          </Button>
        </div>
        <h1 className="create-envelope-page__heading">Create a New Envelope</h1>
        <p className="create-envelope-page__description">
          Here you can create a new envelope to help you compartmentalize your
          expenses.
        </p>
      </header>

      <main className="create-envelope-page__main">
        <form
          onSubmit={handleCreateEnvelope}
          className="create-envelope-page__form"
          autoComplete="off"
        >
          <div className="form-item">
            <label className="form-label" htmlFor="name">
              Name
            </label>
            <input
              className="form-input"
              type="text"
              value={newEnvelopeName}
              onChange={(e) => setNewEnvelopeName(e.target.value)}
              id="name"
              name="name"
              maxLength="30"
            />
          </div>

          <div className="form-item">
            <label className="form-label" htmlFor="budget">
              Budget
            </label>
            <div className="input-with-currency">
              <span className="input-with-currency__currency">
                {fakeCurrency}
              </span>
              <input
                className="form-input input-with-currency__input"
                type="text"
                value={newEnvelopeBudget}
                onChange={(e) => handleValueChange(e, setNewEnvelopeBudget)}
                id="budget"
                name="budget"
              />
            </div>
            <div className="checkbox-group">
              <input
                className="checkbox-input"
                type="checkbox"
                id="amount"
                name="amount"
                checked={isChecked}
                onChange={handleCheckboxChange}
              />
              <label className="checkbox-label" htmlFor="amount">
                {" "}
                Immediately assign full amount <span>ⓘ</span>
              </label>
            </div>
          </div>

          {!isChecked && (
            <div className="form-item">
              <label className="form-label" htmlFor="current-amount">
                Amount to assign
              </label>
              <div className="input-with-currency">
                {" "}
                {/* form-input? */}
                <span className="input-with-currency__currency">
                  {fakeCurrency}
                </span>
                <input
                  className="input-with-currency__input form-input"
                  type="text"
                  value={newEnvelopeCurrentAmount}
                  onChange={(e) =>
                    handleValueChange(e, setNewEnvelopeCurrentAmount)
                  }
                  id="current-amount"
                  name="current-amount"
                />
              </div>
            </div>
          )}

          <div className="form-item">
            <p className="form-p">Color</p>
            <Colors
              newEnvelopeColor={newEnvelopeColor}
              setNewEnvelopeColor={setNewEnvelopeColor}
            />
          </div>

          <div className="form-item">
            <label className="form-label" htmlFor="description">
              Description (optional)
            </label>
            <input
              className="form-input"
              type="text"
              value={newEnvelopeDescription}
              onChange={(e) => setNewEnvelopeDescription(e.target.value)}
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
              Create Envelope
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreateEnvelopePage;
