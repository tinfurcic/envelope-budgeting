import { useEffect, useState } from "react";
import { db } from "../firebase-config";
import { collection, onSnapshot } from "firebase/firestore";
import { useAuth } from "../components/AuthContext";

const useEnvelopesListener = () => {
  const { user } = useAuth();
  const [envelopes, setEnvelopes] = useState([]);
  const [nextEnvelopeId, setNextEnvelopeId] = useState(null);
  const [budgetSum, setBudgetSum] = useState(null);
  const [loadingEnvelopes, setLoadingEnvelopes] = useState(true);
  const [syncingEnvelopes, setSyncingEnvelopes] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    if (!user) return;

    const envelopesRef = collection(db, "users", user.uid, "envelopes");

    const unsubscribe = onSnapshot(envelopesRef, (snapshot) => {
      setSyncingEnvelopes(true);

      let isNewer = false;
      let newNextEnvelopeId = null;
      let newBudgetSum = null;
      let envelopesList = [];

      snapshot.docs.forEach((doc) => {
        const data = doc.data();

        if (doc.id === "metadata") {
          newNextEnvelopeId = data.nextEnvelopeId ?? null;
          newBudgetSum = data.budgetSum ?? null;
        } else {
          envelopesList.push({ id: doc.id, ...data });

          if (
            data.updatedAt &&
            (!lastUpdated || data.updatedAt > lastUpdated)
          ) {
            isNewer = true;
          }
        }
      });

      envelopesList.sort((a, b) => a.order - b.order);

      setEnvelopes(envelopesList);
      setNextEnvelopeId(newNextEnvelopeId);
      setBudgetSum(newBudgetSum);
      setLoadingEnvelopes(false);

      if (isNewer) {
        setLastUpdated(Date.now());
      } else {
        setSyncingEnvelopes(false);
      }
    });

    return () => unsubscribe();
  }, [user, lastUpdated]);

  return {
    envelopes,
    nextEnvelopeId,
    budgetSum,
    loadingEnvelopes,
    syncingEnvelopes,
  };
};

export default useEnvelopesListener;
