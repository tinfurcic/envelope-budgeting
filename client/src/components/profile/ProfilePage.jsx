import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import currenciesBasic from "../../util/currencies-basic.json";
import { updateSettings } from "../../util/axios/updateFunctions";
import Button from "../ui/Button";
import SvgEdit from "../dynamic-icons/SvgEdit";
import Logout from "./Logout";
import Dropdown from "../ui/Dropdown";

const ProfilePage = () => {
  const {
    income,
    savings,
    settings,
    loadingSettings,
    syncingSettings,
    fullDate,
  } = useOutletContext();
  const [selectedCurrency, setSelectedCurrency] = useState(
    settings?.currencyType?.value,
  );
  const [hasChanged, setHasChanged] = useState(false);

  useEffect(() => {
    if (settings?.currencyType?.value) {
      setSelectedCurrency(settings.currencyType.value);
    }
  }, [settings]);

  useEffect(() => {
    if (settings?.currencyType?.value) {
      setHasChanged(selectedCurrency !== settings.currencyType.value);
    }
  }, [selectedCurrency, settings]);

  const currencyCodes = Object.entries(currenciesBasic).map(([code]) => code);
  const fakeCurrency = "€";

  const handleSaveSettings = async (currency, enableDebt) => {
    // save to firebase
    // display saving.../success/error message
    // specifically disable submitting the empty string
    const result = await updateSettings(currency, enableDebt);

    if (!result.success) {
      // display error message
      console.error(result.error);
    } else {
      // display success message
      console.log("Settings successfully updated!");
      setHasChanged(false);
    }
    return;
  };

  return (
    <div className="profile-page">
      <h1 className="profile-page__heading">My Profile</h1>
      <div className="funds">
        <h2 className="funds__heading">My funds</h2>
        <h3 className="funds__category">
          Income <span className="funds__category__info">ⓘ</span>
          <div className="funds__category__edit-icon">
            <Button className="button button--edit">
              <SvgEdit strokeColor="black" fillColor="black" />
            </Button>
          </div>
        </h3>
        <h4 className="funds__category__regular-income">
          Regular income:{" "}
          <span className="funds__category__regular-income__value">
            {fakeCurrency}
            {income?.regularIncome?.value}
          </span>
        </h4>
        <p>
          (i) Here you should put the amount you earn each month reliably and
          consistently. Generated statistics will be more accurate if you don't
          change this number too often.
        </p>
        <h4 className="funds__category__extra-income">
          Extra income (
          {fullDate.toLocaleDateString("en-US", { month: "long" })}
          ):{" "}
          <span className="funds__category__extra-income__value">
            {fakeCurrency}
            {income?.extraIncome?.value}
          </span>
        </h4>
        <p>
          (i) Here you should enter any additional income you get in a given
          month.
        </p>

        <h3 className="funds__category">
          Savings <span className="funds__category__info">ⓘ</span>
          <div className="funds__category__edit-icon">
            <Button className="button button--edit">
              <SvgEdit strokeColor="black" fillColor="black" />
            </Button>
          </div>
        </h3>
        <div className="funds__category__warning">
          <p className="funds__category__warning__text">
            To ensure the best app experience, avoid changing these values
            manually, except when defining your initial funds as a part of
            account setup.
          </p>
        </div>
        <h4 className="funds__category__short-term-savings">
          Short Term Savings:{" "}
          <span className="funds__category__short-term-savings__value">
            {fakeCurrency}
            {savings?.shortTermSavings?.currentAmount}
          </span>
        </h4>
        <h4 className="funds__category__long-term-savings">
          Long Term Savings:{" "}
          <span className="funds__category__long-term-savings__value">
            {fakeCurrency}
            {savings?.longTermSavings?.currentAmount}
          </span>
        </h4>
      </div>

      <div className="settings">
        <h2 className="settings__heading">Settings</h2>
        <div className="settings__currency">
          {loadingSettings ? (
            <p>Loading settings...</p>
          ) : syncingSettings ? (
            <p>Syncing settings</p>
          ) : (
            <>
              Currency{" "}
              <Dropdown
                options={currencyCodes}
                selectedCurrency={selectedCurrency}
                setSelectedCurrency={setSelectedCurrency}
              />
            </>
          )}
          {hasChanged && (
            <Button
              className="button button--green"
              onClick={() => handleSaveSettings(selectedCurrency, false)}
              //onTouchEnd={handleSave}
              isDisabled={!hasChanged}
              extraStyle={{ marginLeft: "auto" }}
            >
              Save
            </Button>
          )}
        </div>

        <div className="settings__item">
          <p>Make expense descriptions mandatory?</p>
        </div>
        <div className="settings__item">
          <p>Allow only input values with 2 decimals?</p>
        </div>
        <div className="settings__item">
          <p>Allow Long Term Savings as an expense source?</p>
        </div>
        <div className="settings__item">
          <p>Use extra income funds for envelope budget?</p>
        </div>
      </div>

      <div className="logout">
        <Logout />
      </div>
    </div>
  );
};

export default ProfilePage;
