/**
 * Central configuration for ML models used across the application.
 * All model-related constants should be sourced from this file to
 * ensure consistency when renaming or adding models.
 */

/** Model accent colors used in cards, charts, and badges */
export const MODEL_COLORS = {
  "Logistic Regression": "#256DB1",
  "Random Forest": "#27AE60",
  LightGBM: "#7C3AED",
  CatBoost: "#D97706",
};

/** Ordered list of all supported algorithms */
export const ALGORITHM_LIST = [
  "Logistic Regression",
  "Random Forest",
  "LightGBM",
  "CatBoost",
];

/** The model designated as the best performer (based on F1-Score evaluation) */
export const BEST_MODEL_NAME = "CatBoost";
