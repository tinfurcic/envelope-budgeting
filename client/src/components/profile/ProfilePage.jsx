import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import currenciesBasic from "../../util/currencies-basic.json";
import { updateSettings } from "../../util/axios/updateFunctions";
import Button from "../ui/Button";
import SvgEdit from "../svg-icons/SvgEdit";
import Logout from "./Logout";
import Dropdown from "../ui/Dropdown";

const ProfilePage = () => {
  const { totalIncome, settings, loadingSettings, syncingSettings, fullDate } =
    useOutletContext();
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
  const fakeExtraIncome = 1500;
  const fakeShortTermSavings = 432;
  const fakeLongTermSavings = 18500;

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
        <div className="funds">
          <h2 className="funds__heading no-margin">My funds</h2>
          <p className="funds__description no-margin-top">
            some text blah some text blah some text blah some text blah some
            text blah some text blah.
          </p>
          <h3 className="funds__category no-margin">
            Income <span className="funds__category__info">ⓘ</span>
            <div className="funds__category__edit-icon">
              <Button className="button button--edit">
                <SvgEdit strokeColor="black" fillColor="black" />
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
              <Button className="button button--edit">
                <SvgEdit strokeColor="black" fillColor="black" />
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
