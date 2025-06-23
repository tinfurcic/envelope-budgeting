import { db } from "../firebase-admin.js";

// Get all settings for a user
export const getSettings = async (userId) => {
  try {
    const settingsSnapshot = await db
      .collection("users")
      .doc(userId)
      .collection("settings")
      .get();

    const settings = {};
    settingsSnapshot.forEach((doc) => {
      settings[doc.id] = doc.data().value;
    });

    return settings;
  } catch (error) {
    console.error("Error fetching settings:", error.message);
    throw new Error("Failed to fetch settings.");
  }
};

// Update both settings
export const updateSettings = async (userId, currencyType, enableDebt) => {
  try {
    const settingsRef = db
      .collection("users")
      .doc(userId)
      .collection("settings");

    // Create a batch
    const batch = db.batch();

    const currencyTypeRef = settingsRef.doc("currencyType");
    const enableDebtRef = settingsRef.doc("enableDebt");

    // Add set operations to the batch
    batch.set(currencyTypeRef, { value: currencyType }, { merge: true });
    batch.set(enableDebtRef, { value: enableDebt }, { merge: true });

    // Commit the batch
    await batch.commit();

    return { currencyType, enableDebt };
  } catch (error) {
    console.error("Error updating settings:", error.message);
    throw new Error("Failed to update settings.");
  }
};

// Update a specific setting
// Not used on the front end
export const updateSettingsType = async (userId, settingType, value) => {
  try {
    const settingsRef = db
      .collection("users")
      .doc(userId)
      .collection("settings")
      .doc(settingType);
    await settingsRef.set({ value }, { merge: true });

    return { [settingType]: value };
  } catch (error) {
    console.error("Error updating setting:", error.message);
    throw new Error("Failed to update setting.");
  }
};
