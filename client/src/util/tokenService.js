import { getAuth } from "firebase/auth";

let cachedToken = null;
let tokenExpirationTime = null; // Store the token's expiration time

export const getToken = async () => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User is not signed in.");
  }

  const currentTime = Date.now();

  // If there's no cached token or the token is expired, refresh it
  if (!cachedToken || currentTime > tokenExpirationTime) {
    cachedToken = await user.getIdToken(true); // Force a refresh
    const decodedToken = JSON.parse(atob(cachedToken.split(".")[1])); // Decode the payload
    tokenExpirationTime = decodedToken.exp * 1000; // Convert to milliseconds
  }

  return cachedToken;
};

export const clearCachedToken = () => {
  cachedToken = null; // Invalidate the cached token
  tokenExpirationTime = null;
};
