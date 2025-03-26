import { useEffect, useState } from "react";
import { db } from "../firebase-config";
import { collection, onSnapshot } from "firebase/firestore";
import { useAuth } from "../components/profile/AuthContext";

const useExpensesListener = () => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [nextExpenseId, setNextExpenseId] = useState(null);
  const [loadingExpenses, setLoadingExpenses] = useState(true);
  const [syncingExpenses, setSyncingExpenses] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    if (!user) return;

    const expensesRef = collection(db, "users", user.uid, "expenses");

    const unsubscribe = onSnapshot(expensesRef, (snapshot) => {
      setSyncingExpenses(true);

      let isNewer = false;
      let newNextExpenseId = null;

      const expensesData = snapshot.docs
        .map((doc) => {
          const data = doc.data();

          if (doc.id === "metadata") {
            newNextExpenseId = data.nextExpenseId ?? null;
            return null;
          }

          if (
            data.updatedAt &&
            (!lastUpdated || data.updatedAt > lastUpdated)
          ) {
            isNewer = true;
          }

          return { id: doc.id, ...data };
        })
        .filter(Boolean);

      setExpenses(expensesData);
      setNextExpenseId(newNextExpenseId);
      setLoadingExpenses(false);

      if (isNewer) {
        setLastUpdated(Date.now());
      } else {
        setSyncingExpenses(false);
      }
    });

    return () => unsubscribe();
  }, [user, lastUpdated]);

  return { expenses, nextExpenseId, loadingExpenses, syncingExpenses };
};

export default useExpensesListener;
