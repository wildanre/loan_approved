import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api",
  timeout: 8000,
});

export const predictLoan = async (payload) => {
  const { data } = await api.post("/predict", payload);
  return data;
};

export const fetchHistory = async (decision) => {
  const { data } = await api.get("/history", {
    params: decision && decision !== "all" ? { decision } : {},
  });
  return data;
};

export const fetchHistoryDetail = async (id) => {
  const { data } = await api.get(`/history/${id}`);
  return data;
};

export const fetchMetrics = async () => {
  const { data } = await api.get("/metrics");
  return data;
};
