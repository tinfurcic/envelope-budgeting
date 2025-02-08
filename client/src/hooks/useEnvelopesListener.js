import { useEffect, useState } from "react";
import { db } from "../firebase-config";
import { collection, onSnapshot } from "firebase/firestore";
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

    const unsubscribe = onSnapshot(envelopesRef, (snapshot) => {
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

/*
import { useEffect, useState } from "react";
import { db } from "../firebase-config";
import { collection, onSnapshot } from "firebase/firestore";
import { useAuth } from "../components/AuthContext";

const useEnvelopesListener = () => {
  const { user } = useAuth();
  const [envelopes, setEnvelopes] = useState([]);
  const [loadingEnvelopes, setLoadingEnvelopes] = useState(true);
  const [syncingEnvelopes, setSyncingEnvelopes] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null); // ✅ Track last update

  useEffect(() => {
    if (!user) return;

    const envelopesRef = collection(db, "users", user.uid, "envelopes");

    const unsubscribe = onSnapshot(envelopesRef, (snapshot) => {
      let isNewer = false;

      const envelopeData = snapshot.docs
        .filter(doc => doc.id !== 'metadata')
        .map(doc => {
          const data = doc.data();
          if (data.updatedAt && (!lastUpdated || data.updatedAt > lastUpdated)) {
            isNewer = true;
          }
          return { id: doc.id, ...data };
        });

      if (isNewer) {
        setSyncingEnvelopes(true);
        setLastUpdated(Date.now());
      }
      
      setEnvelopes(envelopeData);
      setLoadingEnvelopes(false);

      if (!isNewer) {
        setSyncingEnvelopes(false);
      }
    });

    return () => unsubscribe();
  }, [user, lastUpdated]); // Depend on lastUpdated

  return { envelopes, loadingEnvelopes, syncingEnvelopes };
};

export default useEnvelopesListener;
*/
