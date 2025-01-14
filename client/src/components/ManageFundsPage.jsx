import React from "react";
import { useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import editIcon from "../media/edit-icon.png";

const ManageFundsPage = () => {
  const navigate = useNavigate();
  const { totalBudget, date } = useOutletContext();
  const fakeCurrency = "€";
  const fakeExtraIncome = 1500;
  const fakeShortTermSavings = 432;
  const fakeLongTermSavings = 18500;

  return (
    <div className="funds-page">
      <div className="funds-page__exit">
        <button
          className="funds-page__exit__btn"
          onClick={() => navigate("/home")}
        >
          X
        </button>
      </div>
      <h3>
        Income <span>ⓘ</span>
      </h3>
      <h4 className="funds-page__regular-income">
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
      </h4>
      <h4 className="funds-page__extra-income">
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
      </h4>
      <h3>
        Savings <span>ⓘ</span>
      </h3>
      <div className="funds-page__warning">
        <p className="funds-page__warning__text">
          To ensure the best app experience, avoid changing these values
          manually, except as a part of account setup.
        </p>
      </div>
      <div className="funds-page__short-term-savings">
        <h4>
          Short Term Savings <span>ⓘ</span>
        </h4>
        <span className="funds-page__short-term-savings__value">
          {fakeShortTermSavings}
          {fakeCurrency}
        </span>
      </div>
      <div className="funds-page__long-term-savings">
        <h4>
          Long Term Savings <span>ⓘ</span>
        </h4>
        <span className="funds-page__long-term-savings__value">
          {fakeLongTermSavings}
          {fakeCurrency}
        </span>
      </div>
    </div>
  );
};

export default ManageFundsPage;

//<img src={backArrow} alt="Back" className="funds-page__exit__btn__img" width="28" />
//back
