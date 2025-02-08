import express from "express";
import {
  getSettings,
  updateSettingsType,
  updateSettings,
} from "../settings.js";

export const settingsRouter = express.Router();

settingsRouter.use((req, res, next) => {
  const userId = req.user?.uid;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized: Missing user ID" });
  }
  req.userId = userId;
  next();
});

// GET all settings
settingsRouter.get("/", async (req, res) => {
  try {
    const settings = await getSettings(req.userId);
    res.status(200).json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error.message);
    res.status(500).json({ error: `Internal server error: ${error.message}` });
  }
});

// PATCH to update both settings in a single request
settingsRouter.patch("/", async (req, res) => {
  const { currencyType, enableDebt } = req.body;

  // Ensure both fields are provided
  if (currencyType === undefined || enableDebt === undefined) {
    return res.status(400).json({
      error: "'currencyType' and 'enableDebt' must be provided.",
    });
  }

  // Ensure valid types
  if (typeof currencyType !== "string" || typeof enableDebt !== "boolean") {
    return res.status(400).json({
      error:
        "'currencyType' must be a string, and 'enableDebt' must be a boolean.",
    });
  }

  try {
    const updatedSettings = await updateSettings(
      req.userId,
      currencyType,
      enableDebt,
    );
    res.status(200).json(updatedSettings);
  } catch (error) {
    console.error("Error updating settings:", error.message);
    res.status(500).json({ error: `Internal server error: ${error.message}` });
  }
});

// PATCH to update a specific setting
// Isn't used on the front end
settingsRouter.patch("/:settingType", async (req, res) => {
  const { settingType } = req.params;
  const { value } = req.body;

  const allowedSettings = ["currencyType", "enableDebt"];
  if (!allowedSettings.includes(settingType)) {
    return res.status(400).json({ error: "Invalid settingType." });
  }

  if (
    (settingType === "currencyType" && typeof value !== "string") ||
    (settingType === "enableDebt" && typeof value !== "boolean")
  ) {
    return res
      .status(400)
      .json({ error: "Invalid value for the setting type." });
  }

  try {
    const updatedSetting = await updateSettingsType(
      req.userId,
      settingType,
      value,
    );
    res.status(200).json(updatedSetting);
  } catch (error) {
    console.error("Error updating setting:", error.message);
    res.status(500).json({ error: `Internal server error: ${error.message}` });
  }
});

export default settingsRouter;
