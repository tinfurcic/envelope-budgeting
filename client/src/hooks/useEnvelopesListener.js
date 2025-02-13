import { useEffect, useState } from "react";
import { db } from "../firebase-config";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { useAuth } from "../components/AuthContext";

const useEnvelopesListener = () => {
  const { user } = useAuth();
  const [envelopes, setEnvelopes] = useState([]);
  const [nextEnvelopeId, setNextEnvelopeId] = useState(null);
  const [loadingEnvelopes, setLoadingEnvelopes] = useState(true);
  const [syncingEnvelopes, setSyncingEnvelopes] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    if (!user) return;

    const envelopesRef = collection(db, "users", user.uid, "envelopes");

    // Create a query that orders envelopes by the `order` field
    const envelopesQuery = query(envelopesRef, orderBy("order"));

    const unsubscribe = onSnapshot(envelopesQuery, (snapshot) => {
      setSyncingEnvelopes(true);

      let isNewer = false;
      let newNextEnvelopeId = null;

      const envelopeData = snapshot.docs
        .map((doc) => {
          const data = doc.data();

          if (doc.id === "metadata") {
            newNextEnvelopeId = data.nextEnvelopeId ?? null;
            return null; // Skip including metadata in envelopes state
          }

          if (
            data.updatedAt &&
            (!lastUpdated || data.updatedAt > lastUpdated)
          ) {
            isNewer = true;
          }

          return { id: doc.id, ...data };
        })
        .filter(Boolean); // Remove null values (metadata)

      setEnvelopes(envelopeData);
      setNextEnvelopeId(newNextEnvelopeId);
      setLoadingEnvelopes(false);
      if (isNewer) {
        setLastUpdated(Date.now());
      } else {
        setSyncingEnvelopes(false);
      }
    });

    return () => unsubscribe();
  }, [user, lastUpdated]);

  return { envelopes, nextEnvelopeId, loadingEnvelopes, syncingEnvelopes };
};

export default useEnvelopesListener;
