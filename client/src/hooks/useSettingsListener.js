import { useEffect, useState } from "react";
import { db } from "../firebase-config";
import { collection, onSnapshot } from "firebase/firestore";
import { useAuth } from "../components/AuthContext";

const useSettingsListener = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState([]);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [syncingSettings, setSyncingSettings] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    if (!user) return;

    const settingsRef = collection(db, "users", user.uid, "settings");

    const unsubscribe = onSnapshot(settingsRef, (snapshot) => {
      setSyncingSettings(true);

      let isNewer = false;

      const settingsData = snapshot.docs.map((doc) => {
        const data = doc.data();

        if (data.updatedAt && (!lastUpdated || data.updatedAt > lastUpdated)) {
          isNewer = true;
        }

        return { id: doc.id, ...data };
      });

      setSettings(settingsData);
      setLoadingSettings(false);
      if (isNewer) {
        setLastUpdated(Date.now());
      } else {
        setSyncingSettings(false);
      }
    });

    return () => unsubscribe();
  }, [user, lastUpdated]);

  return { settings, loadingSettings, syncingSettings };
};

export default useSettingsListener;
