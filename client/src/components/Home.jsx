import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import ProgressBar from "./ProgressBar";
import SettingsButton from "./SettingsButton";
import { useAuth } from "./AuthContext";

const Home = () => {
  const { user } = useAuth();
  console.log(user);

  const navigate = useNavigate();
  const fakeEnvelopeSum = 1000;
  const { totalBudget } = useOutletContext();
  const [percentage, setPercentage] = useState(
    Math.round((fakeEnvelopeSum * 100) / totalBudget),
  );

  useEffect(() => {
    setPercentage(Math.round((fakeEnvelopeSum * 100) / totalBudget));
  }, [fakeEnvelopeSum, totalBudget]);
  // fakeEnvelopeSum will later be a useState variable

  return (
    <>
      <div className="budget-overview">
        <div className="budget-overview__header">
          <h2>My funds</h2>
          <SettingsButton
            handleClick={() => navigate("/funds")}
            buttonText="Manage funds"
          />
        </div>
        <ProgressBar percentage={percentage} />
      </div>
      <div className="latest-expenses">
        <h2>Latest expenses</h2>
        {/* Show saved transactions, from newest to oldest */}
      </div>
      <div className="this-month-stats">
        <h2>This month's stats</h2>
      </div>
    </>
  );
};

export default Home;

//import { useAuth } from "./AuthContext";
//const { user } = useAuth();
//<h1>HENLO {user ? user.email : "Guestinho"}</h1>
//{console.log(user)}
