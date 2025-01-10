import { doc, setDoc, collection } from "firebase/firestore";
import { db } from "../../firebase-config";

export const saveEnvelope = async (userId, envelopeData) => {
  try {
    const envelopeRef = doc(collection(db, `users/${userId}/envelopes`));
    await setDoc(envelopeRef, envelopeData);
    console.log("Envelope saved!");
  } catch (error) {
    console.error("Error saving envelope:", error);
  }
};
