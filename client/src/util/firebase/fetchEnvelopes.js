/*
import { collection, getDocs } from "firebase/firestore";

export const fetchEnvelopes = async (userId) => {
  try {
    const envelopesRef = collection(db, `users/${userId}/envelopes`);
    const querySnapshot = await getDocs(envelopesRef);
    const envelopes = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log("Envelopes fetched:", envelopes);
    return envelopes;
  } catch (error) {
    console.error("Error fetching envelopes:", error);
  }
};
*/

import { db } from "./firebase-admin";  // Import the db object

export const fetchEnvelopes = async (userId) => {
  try {
    // Reference the sub-collection "envelopes" under the user document
    const envelopesRef = db.collection("users").doc(userId).collection("envelopes");

    // Fetch all documents in the "envelopes" collection
    const querySnapshot = await envelopesRef.get();

    // Map over the documents and extract their data
    const envelopes = querySnapshot.docs.map((doc) => ({
      id: doc.id, // Document ID
      ...doc.data(), // Document data as an object
    }));

    console.log("Envelopes fetched (Admin SDK):", envelopes);
    return envelopes;
  } catch (error) {
    console.error("Error fetching envelopes (Admin SDK):", error);
    throw new Error("Failed to fetch envelopes. Please try again later.");
  }
};

/*
const fetchEnvelopes = async (uid) => {
  try {
    // Access the 'envelopes' collection and query for documents based on 'uid'
    const envelopesRef = db.collection('envelopes').where("uid", "==", uid);
    const snapshot = await envelopesRef.get();

    if (snapshot.empty) {
      console.log('No envelopes found');
      return [];
    }

    const envelopes = snapshot.docs.map(doc => doc.data());
    console.log("Envelopes:", envelopes);
    return envelopes;
  } catch (error) {
    console.error("Error fetching envelopes:", error);
    throw new Error("Error fetching envelopes");
  }
};

// Example usage: Fetch envelopes for a specific user UID
fetchEnvelopes("some-user-uid")
  .then((envelopes) => {
    console.log("Fetched envelopes:", envelopes);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
*/