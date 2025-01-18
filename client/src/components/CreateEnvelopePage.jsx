import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { createEnvelope } from "../util/axios/createEnvelope";
import Button from "./Button";
import backArrow from "../media/back-arrow.png";

const CreateEnvelopePage = () => {
  const { setEnvelopes } = useOutletContext();

  const [newEnvelopeName, setNewEnvelopeName] = useState("");
  const [newEnvelopeBudget, setNewEnvelopeBudget] = useState("");
  const [newEnvelopeCurrentAmount, setNewEnvelopeCurrentAmount] = useState("");
  const [newEnvelopeDescription, setNewEnvelopeDescription] = useState("");
  const [isChecked, setIsChecked] = useState(true);
  const [isDisabled, setIsDisabled] = useState(true);

  const fakeCurrency = "€";

  const handleCreateEnvelope = async (e) => {
    e.preventDefault();
    const result = await createEnvelope(
      newEnvelopeName,
      Number(newEnvelopeBudget),
      Number(newEnvelopeCurrentAmount),
      setEnvelopes,
    );

    if (!result.success) {
      // display error message
      console.error(result.error);
    } else {
      // display success message
      setNewEnvelopeName("");
      setNewEnvelopeBudget("");
      setNewEnvelopeCurrentAmount("");
      setNewEnvelopeDescription("");
    }
  };

  const handleValueChange = (event, setValue) => {
    const value = event.target.value;
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
  }

  useEffect(() => {
    if (isChecked) {
      setNewEnvelopeCurrentAmount(newEnvelopeBudget);
    } 
  }, [isChecked, newEnvelopeBudget]);

  useEffect(() => {
    if (parseFloat(newEnvelopeBudget) <= parseFloat(newEnvelopeCurrentAmount)) {
      setNewEnvelopeCurrentAmount(newEnvelopeBudget);
    }
  }, [newEnvelopeBudget, newEnvelopeCurrentAmount]);

  useEffect(() => {
    setIsDisabled(newEnvelopeName === "" || 
      newEnvelopeBudget === "" || 
      newEnvelopeBudget === "0" || 
      newEnvelopeCurrentAmount === "")
    }, [newEnvelopeName, newEnvelopeBudget, newEnvelopeCurrentAmount]);

  return (
    <div className="create-envelope-page">
      <div className="create-envelope-page__nav-back">
        <Button 
          type="button" 
          className="back-btn" 
          navigateTo="/envelopes"
          variant={null} 
          isDisabled={false} 
        >
          <img src={backArrow} alt="Back" width="20" /> to My Envelopes
        </Button>
      </div>
      
      <h1 className="create-envelope-page__heading no-margin">Create a New Envelope</h1>
      <p className="create-envelope-page__description no-margin-top">Here you can create a new envelope to help you compartmentalize your expenses.</p>

      <form onSubmit={handleCreateEnvelope} className="create-envelope-page__form" autoComplete="off">
        <div className="create-envelope-page__form__item">
          <label className="create-envelope-page__form__item__label" htmlFor="name" >Name</label>
          <input
            className="create-envelope-page__form__item__input"
            type="text"
            value={newEnvelopeName}
            onChange={(e) => setNewEnvelopeName(e.target.value)}
            id="name"
            name="name"
            maxLength="30"
          />
        </div>

        <div className="create-envelope-page__form__item">
          <label className="create-envelope-page__form__item__label" htmlFor="budget" >Budget</label>
          <div className="create-envelope-page__form__item__input--with-currency" >
            <span className="create-envelope-page__form__item__input--with-currency__currency" >{fakeCurrency}</span>
            <input 
              className="create-envelope-page__form__item__input--with-currency__input"
              type="text"
              value={newEnvelopeBudget}
              onChange={(e) => handleValueChange(e, setNewEnvelopeBudget)}
              id="budget"
              name="budget"
            />
          </div>
          <div className="create-envelope-page__form__item__checkbox">
            <input className="create-envelope-page__form__item__checkbox__input" type="checkbox" id="amount" name="amount" checked={isChecked} onChange={handleCheckboxChange} />
            <label className="create-envelope-page__form__item__checkbox__label" htmlFor="amount" > Immediately assign full amount <span>ⓘ</span></label>
          </div>
        </div>

        { !isChecked &&
          <div className="create-envelope-page__form__item">
            <label className="create-envelope-page__form__item__label" htmlFor="current-amount" >Amount to assign</label>
            <div className="create-envelope-page__form__item__input--with-currency" >
            <span className="create-envelope-page__form__item__input--with-currency__currency" >{fakeCurrency}</span>
              <input 
                className="create-envelope-page__form__item__input--with-currency__input"
                type="text"
                value={newEnvelopeCurrentAmount}
                onChange={(e) => handleValueChange(e, setNewEnvelopeCurrentAmount)}
                id="current-amount"
                name="current-amount"
              />
              </div>
        </div>}

        <div className="create-envelope-page__form__item">
        <label className="create-envelope-page__form__item__label" htmlFor="description" >Description (optional)</label>
          <input 
            className="create-envelope-page__form__item__input"
            type="text"
            value={newEnvelopeDescription}
            onChange={(e) => setNewEnvelopeDescription(e.target.value)}
            id="description"
            name="description"
          />
        </div>

        <div className="create-envelope-page__form__submit-btn">
          <Button type="submit" className="button" navigateTo={null} variant="green" isDisabled={isDisabled} >
            Create Envelope
          </Button>
        </div>
        
      </form>
    </div>
  );
};

export default CreateEnvelopePage;
