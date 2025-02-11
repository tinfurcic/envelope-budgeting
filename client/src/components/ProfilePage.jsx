import React from "react";
import { useOutletContext } from "react-router-dom";
import CurrencyDropdown from "./CurrencyDropdown";
import Button from "./Button";
import editIcon from "../media/edit-icon.png";
import Logout from "./Logout";

const ProfilePage = () => {
  const { totalIncome, fullDate } = useOutletContext();
  const fakeCurrency = "€";
  const fakeExtraIncome = 1500;
  const fakeShortTermSavings = 432;
  const fakeLongTermSavings = 18500;

  return (
    <div className="profile-page">
      <h1 className="profile-page__heading">My Profile</h1>
      <div className="settings">
        <h2 className="settings__heading">Settings</h2>
        <div className="settings__currency">
          <CurrencyDropdown />
        </div>
        <div className="funds">
          <h2 className="funds__heading no-margin">My funds</h2>
          <p className="funds__description no-margin-top">
            some text blah some text blah some text blah some text blah some
            text blah some text blah.
          </p>
          <h3 className="funds__category no-margin">
            Income <span className="funds__category__info">ⓘ</span>
            <div className="funds__category__edit-icon">
              <Button
                type="button"
                className="button button--edit"
                onClick={null}
                isDisabled={false}
              >
                <img src={editIcon} alt="Edit Icon" />
              </Button>
            </div>
          </h3>
          {/* maybe income types should be in <p> */}
          <p className="funds__category__regular-income no-margin">
            Regular income:{" "}
            <span className="funds__category__regular-income__value">
              {fakeCurrency}
              {totalIncome}
            </span>
          </p>
          <p className="funds__category__extra-income no-margin-top">
            Extra income (
            {fullDate.toLocaleDateString("en-US", { month: "long" })}
            ):{" "}
            <span className="funds__category__extra-income__value">
              {fakeCurrency}
              {fakeExtraIncome}
            </span>
          </p>
          <h3 className="funds__category no-margin">
            Savings <span className="funds__category__info">ⓘ</span>
            <div className="funds__category__edit-icon">
              <Button
                type="button"
                className="button button--edit"
                onClick={null}
                isDisabled={false}
              >
                <img src={editIcon} alt="Edit Icon" />
              </Button>
            </div>
          </h3>
          <div className="funds__category__warning">
            <p className="funds__category__warning__text no-margin">
              To ensure the best app experience, avoid changing these values
              manually, except when defining your initial funds as a part of
              account setup.
            </p>
          </div>
          <p className="funds__category__short-term-savings">
            Short Term Savings:{" "}
            <span className="funds__category__short-term-savings__value">
              {fakeCurrency}
              {fakeShortTermSavings}
            </span>
          </p>
          <p className="funds__category__long-term-savings">
            Long Term Savings:{" "}
            <span className="funds__category__long-term-savings__value">
              {fakeCurrency}
              {fakeLongTermSavings}
            </span>
          </p>
        </div>
      </div>
      <div className="logout">
        <Logout />
      </div>
    </div>
  );
};

export default ProfilePage;
