import { getAuth, onIdTokenChanged } from "firebase/auth";

export const getToken = async () => {
  const auth = getAuth();
  if (!auth.currentUser) {
    throw new Error("User is not signed in.");
  }

  return auth.currentUser.getIdToken(); // Always gets a fresh token if needed
};

export const listenForTokenRefresh = (callback) => {
  const auth = getAuth();

  // Return the unsubscribe function so we can clean up the listener
  return onIdTokenChanged(auth, async (user) => {
    if (user) {
      const newToken = await user.getIdToken();
      callback(newToken);
    } else {
      callback(null);
    }
  });
};
