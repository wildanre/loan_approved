import axios from "axios";

const api = axios.create({

  baseURL: import.meta.env.VITE_API_BASE_URL ?? "/api",
  timeout: 10000, // 10 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a response interceptor to uniformly handle standard API errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.data) {
      console.error("API Error Response:", error.response.data);
    } else {
      console.error("API Connection Error:", error.message);
    }
    return Promise.reject(error);
  }
);

/**
 * Submits applicant data for real-time inference across all 4 ML models.
 * @param {Object} payload - Customer data matching backend schema
 * @returns {Promise<Object>} Model predictions and majority consensus
 */
export const predictLoan = async (payload) => {
  const { data } = await api.post("/predict", payload);
  return data;
};

/**
 * Retrieves the history of all predictions stored in the backend database.
 * @param {string} [decision] - Optional filter: "all", "Approved", or "Rejected"
 * @returns {Promise<Array>} List of historical prediction records
 */
export const fetchHistory = async (decision) => {
  const { data } = await api.get("/history", {
    params: decision && decision !== "all" ? { decision } : {},
  });
  return data;
};

/**
 * Retrieves detailed information about a single prediction record.
 * @param {string|number} id - The database ID of the prediction
 * @returns {Promise<Object>} Detailed prediction record
 */
export const fetchHistoryDetail = async (id) => {
  const { data } = await api.get(`/history/${id}`);
  return data;
};

/**
 * Retrieves the pre-calculated model evaluation metrics (accuracy, F1, etc.).
 * @returns {Promise<Object>} Baseline and tuned evaluation metrics
 */
export const fetchMetrics = async () => {
  const { data } = await api.get("/metrics");
  return data;
};

export default api;
