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
