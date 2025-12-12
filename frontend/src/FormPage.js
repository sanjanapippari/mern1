import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "./config";

export default function FormPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("📤 Submitting form:", form);
      const response = await axios.post(`${API_BASE_URL}/api/form`, form, {
        headers: {
          "Content-Type": "application/json"
        }
      });
      console.log("✅ Form submitted successfully:", response.data);
      navigate("/results");
    } catch (error) {
      console.error("❌ Error submitting form:", error);
      console.error("❌ Full error object:", JSON.stringify(error, null, 2));
      console.error("❌ Error response:", error.response);
      console.error("❌ Error response data:", error.response?.data);
      console.error("❌ Error response status:", error.response?.status);
      
      let errorMessage = "Failed to submit form";
      
      if (error.response?.data) {
        const data = error.response.data;
        // Handle different error response formats
        if (typeof data.error === "string") {
          errorMessage = data.error;
        } else if (typeof data.error === "object" && data.error !== null) {
          // If error is an object, try to extract message or stringify it
          errorMessage = data.error.message || data.error.toString() || JSON.stringify(data.error);
        } else if (data.message) {
          errorMessage = data.message;
        } else if (typeof data === "string") {
          errorMessage = data;
        } else {
          // Last resort: stringify the entire response
          errorMessage = JSON.stringify(data);
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // Ensure errorMessage is a string
      if (typeof errorMessage !== "string") {
        errorMessage = String(errorMessage) || "Unknown error occurred";
      }
      
      alert(`Error: ${errorMessage}\n\nStatus: ${error.response?.status || "Unknown"}\n\nCheck the browser console and backend logs for more details.`);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{width:"350px", margin:"50px auto"}}>
      <h2>Contact Form</h2>
      
      <input
        placeholder="Name"
        onChange={e => setForm({ ...form, name: e.target.value })}
        required
      /><br /><br />

      <input
        placeholder="Email"
        onChange={e => setForm({ ...form, email: e.target.value })}
        required
      /><br /><br />

      <textarea
        placeholder="Message"
        onChange={e => setForm({ ...form, message: e.target.value })}
        required
      ></textarea><br /><br />

      <button type="submit">Submit</button>
    </form>
  );
}
