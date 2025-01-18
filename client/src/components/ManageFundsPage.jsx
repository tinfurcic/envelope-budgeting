import React from "react";
import { useOutletContext } from "react-router-dom";
import editIcon from "../media/edit-icon.png";
import Button from "./Button";
import backArrow from "../media/back-arrow.png";

const ManageFundsPage = () => {
  const { totalBudget, date } = useOutletContext();
  const fakeCurrency = "€";
  const fakeExtraIncome = 1500;
  const fakeShortTermSavings = 432;
  const fakeLongTermSavings = 18500;

  return (
    <div className="funds-page">
      <div className="funds-page__nav-back">
        <Button 
          type="button" 
          className="back-btn" 
          navigateTo="/home"
          variant={null} 
          isDisabled={false} 
        >
          <img src={backArrow} alt="Back" width="20" /> to Home
        </Button>
      </div>
      <h2 className="no-margin">
        Income <span>ⓘ</span>
      </h2>
      <p className="no-margin-top">some text blah some text blah some text blah some text blah some text blah some text blah.</p>
      <h3 className="funds-page__regular-income no-margin">
        Regular income:{" "}
        <span className="funds-page__regular-income__value">
          {totalBudget}
          {fakeCurrency}
        </span>
        <img
          src={editIcon}
          alt="Edit Icon"
          className="funds-page__regular-income__edit-icon"
          width="16"
        />
      </h3>
      <h3 className="funds-page__extra-income no-margin-top">
        Extra income ({date.toLocaleDateString("en-US", { month: "long" })}):{" "}
        <span className="funds-page__extra-income__value">
          {fakeExtraIncome}
          {fakeCurrency}
        </span>
        <img
          src={editIcon}
          alt="Edit Icon"
          className="funds-page__regular-income__edit-icon"
          width="16"
        />
      </h3>
      <h2 className="no-margin">
        Savings <span>ⓘ</span>
      </h2>
      <div className="funds-page__warning">
        <p className="funds-page__warning__text no-margin">
          To ensure the best app experience, avoid changing these values
          manually, except as a part of account setup.
        </p>
      </div>
      <div className="funds-page__short-term-savings">
        <h3>
          Short Term Savings <span>ⓘ</span>
        </h3>
        <span className="funds-page__short-term-savings__value">
          {fakeShortTermSavings}
          {fakeCurrency}
        </span>
      </div>
      <div className="funds-page__long-term-savings">
        <h3>
          Long Term Savings <span>ⓘ</span>
        </h3>
        <span className="funds-page__long-term-savings__value">
          {fakeLongTermSavings}
          {fakeCurrency}
        </span>
      </div>
    </div>
  );
};

export default ManageFundsPage;