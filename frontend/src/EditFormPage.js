import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(true);

  // Fetch the form data when component loads
  useEffect(() => {
    const fetchForm = async () => {
      try {
        console.log("📥 Fetching form with ID:", id);
        const response = await axios.get(`/api/form/${id}`);
        console.log("✅ Form fetched:", response.data);
        setForm({
          name: response.data.name || "",
          email: response.data.email || "",
          message: response.data.message || ""
        });
        setLoading(false);
      } catch (error) {
        console.error("❌ Error fetching form:", error);
        alert("Error loading form: " + (error.response?.data?.error || error.message));
        navigate("/results");
      }
    };

    if (id) {
      fetchForm();
    } else {
      setLoading(false);
    }
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("📤 Updating form:", form);
      const response = await axios.put(`/api/form/${id}`, form, {
        headers: {
          "Content-Type": "application/json"
        }
      });
      console.log("✅ Form updated successfully:", response.data);
      alert("Form updated successfully!");
      navigate("/results");
    } catch (error) {
      console.error("❌ Error updating form:", error);
      console.error("❌ Error response:", error.response);
      
      let errorMessage = "Failed to update form";
      
      if (error.response?.data) {
        const data = error.response.data;
        if (typeof data.error === "string") {
          errorMessage = data.error;
        } else if (data.message) {
          errorMessage = data.message;
        } else {
          errorMessage = JSON.stringify(data);
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(`Error: ${errorMessage}\n\nStatus: ${error.response?.status || "Unknown"}`);
    }
  };

  if (loading) {
    return <div style={{textAlign:"center", margin:"50px"}}>Loading...</div>;
  }

  return (
    <div style={{width:"350px", margin:"50px auto"}}>
      <h2>Edit Form</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          required
          style={{width:"100%", padding:"8px", marginBottom:"10px"}}
        /><br />

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          required
          style={{width:"100%", padding:"8px", marginBottom:"10px"}}
        /><br />

        <textarea
          placeholder="Message"
          value={form.message}
          onChange={e => setForm({ ...form, message: e.target.value })}
          required
          rows="5"
          style={{width:"100%", padding:"8px", marginBottom:"10px"}}
        ></textarea><br />

        <div style={{display:"flex", gap:"10px"}}>
          <button 
            type="submit"
            style={{
              padding:"10px 20px", 
              cursor:"pointer",
              backgroundColor:"#4CAF50",
              color:"white",
              border:"none",
              borderRadius:"4px",
              flex:1
            }}
          >
            Update
          </button>
          <button 
            type="button"
            onClick={() => navigate("/results")}
            style={{
              padding:"10px 20px", 
              cursor:"pointer",
              backgroundColor:"#9e9e9e",
              color:"white",
              border:"none",
              borderRadius:"4px",
              flex:1
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

