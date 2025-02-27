import { useEffect, useState } from "react";
import { db } from "../firebase-config";
import { collection, onSnapshot } from "firebase/firestore";
import { useAuth } from "../components/AuthContext";

const useGoalsListener = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState([]);
  const [nextGoalId, setNextGoalId] = useState(null);
  const [loadingGoals, setLoadingGoals] = useState(true);
  const [syncingGoals, setSyncingGoals] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    if (!user) return;

    const goalsRef = collection(db, "users", user.uid, "goals");

    const unsubscribe = onSnapshot(goalsRef, (snapshot) => {
      setSyncingGoals(true);

      let isNewer = false;
      let newNextGoalId = null;
      let goalsList = [];

      snapshot.docs.forEach((doc) => {
        const data = doc.data();

        if (doc.id === "metadata") {
          newNextGoalId = data.nextGoalId ?? null;
        } else {
          goalsList.push({ id: doc.id, ...data });

          if (
            data.updatedAt &&
            (!lastUpdated || data.updatedAt > lastUpdated)
          ) {
            isNewer = true;
          }
        }
      });

      setGoals(goalsList);
      setNextGoalId(newNextGoalId);
      setLoadingGoals(false);

      if (isNewer) {
        setLastUpdated(Date.now());
      } else {
        setSyncingGoals(false);
      }
    });

    return () => unsubscribe();
  }, [user, lastUpdated]);

  return { goals, nextGoalId, loadingGoals, syncingGoals };
};

export default useGoalsListener;
