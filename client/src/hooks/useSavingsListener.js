import { useEffect, useState } from "react";
import { db } from "../firebase-config";
import { collection, onSnapshot } from "firebase/firestore";
import { useAuth } from "../components/profile/AuthContext";

const useSavingsListener = () => {
  const { user } = useAuth();
  const [savings, setSavings] = useState({});
  const [loadingSavings, setLoadingSavings] = useState(true);
  const [syncingSavings, setSyncingSavings] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    if (!user) return;

    const savingsRef = collection(db, "users", user.uid, "savings");

    const unsubscribe = onSnapshot(savingsRef, (snapshot) => {
      setSyncingSavings(true);

      let isNewer = false;

      const savingsData = {};
      snapshot.docs.forEach((doc) => {
        const data = doc.data();

        if (data.updatedAt && (!lastUpdated || data.updatedAt > lastUpdated)) {
          isNewer = true;
        }

        savingsData[doc.id] = { id: doc.id, ...data };
      });

      setSavings(savingsData);
      setLoadingSavings(false);
      if (isNewer) {
        setLastUpdated(Date.now());
      } else {
        setSyncingSavings(false);
      }
    });

    return () => unsubscribe();
  }, [user, lastUpdated]);

  return { savings, loadingSavings, syncingSavings };
};

export default useSavingsListener;
