import { useEffect, useState } from "react";
import { db } from "../firebase-config";
import { collection, onSnapshot } from "firebase/firestore";
import { useAuth } from "../components/AuthContext";

const useIncomeListener = () => {
  const { user } = useAuth();
  const [income, setIncome] = useState([]);
  const [loadingIncome, setLoadingIncome] = useState(true);
  const [syncingIncome, setSyncingIncome] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    if (!user) return;

    const incomeRef = collection(db, "users", user.uid, "income");

    const unsubscribe = onSnapshot(incomeRef, (snapshot) => {
      setSyncingIncome(true);

      let isNewer = false;

      const incomeData = {};
      snapshot.docs.forEach((doc) => {
        const data = doc.data();

        if (data.updatedAt && (!lastUpdated || data.updatedAt > lastUpdated)) {
          isNewer = true;
        }

        incomeData[doc.id] = { id: doc.id, ...data };
      });

      setIncome(incomeData);
      setLoadingIncome(false);
      if (isNewer) {
        setLastUpdated(Date.now());
      } else {
        setSyncingIncome(false);
      }
    });

    return () => unsubscribe();
  }, [user, lastUpdated]);

  return { income, loadingIncome, syncingIncome };
};

export default useIncomeListener;
