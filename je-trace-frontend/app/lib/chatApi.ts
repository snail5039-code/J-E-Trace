import axios from "axios";

export const sendMessage = async (message: string) => {
  const res = await axios.post("/api/chat", {
    message,
  });
  return res.data;
};