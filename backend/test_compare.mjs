import axios from "axios";

(async () => {
  try {
    const res = await axios.post("http://localhost:5000/api/auth/login", {
      email: "pyq@gmail.com",
      password: "1234",
    });
    console.log("✅ Response from backend:", res.data);
  } catch (err) {
    console.error("❌ Error response:", err.response?.data || err.message);
  }
})();
