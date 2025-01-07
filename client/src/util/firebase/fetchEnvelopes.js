import { db } from "./firebase-admin"; // Import the db object

export const fetchEnvelopes = async (userId) => {
  try {
    // Reference the sub-collection "envelopes" under the user document
    const envelopesRef = db.collection("users").doc(userId).collection("envelopes");

    // Exclude the "metadata" document from the query
    const querySnapshot = await envelopesRef.where("__name__", "!=", "metadata").get();

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
