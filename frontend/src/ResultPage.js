import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "./config";

export default function ResultPage() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  // Fetch all forms
  const fetchForms = () => {
    axios.get(`${API_BASE_URL}/api/form`)
      .then(res => {
        console.log("✅ Fetched submissions:", res.data);
        setData(res.data);
      })
      .catch(error => {
        console.error("❌ Error fetching submissions:", error);
        console.error("❌ Error response:", error.response);
        alert("Error fetching data: " + (error.response?.data?.error || error.message));
      });
  };

  useEffect(() => {
    fetchForms();
  }, []);

  // Handle Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this form?")) {
      return;
    }

    try {
      console.log("🗑️ Deleting form with ID:", id);
      await axios.delete(`${API_BASE_URL}/api/form/${id}`);
      console.log("✅ Form deleted successfully");
      alert("Form deleted successfully!");
      // Refresh the list
      fetchForms();
    } catch (error) {
      console.error("❌ Error deleting form:", error);
      alert("Error deleting form: " + (error.response?.data?.error || error.message));
    }
  };

  // Handle Edit - Navigate to edit page
  const handleEdit = (id) => {
    navigate(`/edit/${id}`);
  };

  return (
    <div style={{width:"90%", margin:"auto", padding:"20px"}}>
      <h2>Submitted Data</h2>
      <button 
        onClick={() => navigate("/")} 
        style={{marginBottom:"20px", padding:"10px 20px", cursor:"pointer"}}
      >
        Add New Form
      </button>
      
      {data.length === 0 ? (
        <p>No submissions yet. <button onClick={() => navigate("/")}>Add one now!</button></p>
      ) : (
        <table border="1" cellPadding="8" style={{width:"100%", borderCollapse:"collapse"}}>
          <thead>
            <tr style={{backgroundColor:"#f0f0f0"}}>
              <th>Name</th>
              <th>Email</th>
              <th>Message</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item._id}>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>{item.message}</td>
                <td>
                  <button 
                    onClick={() => handleEdit(item._id)}
                    style={{
                      marginRight:"10px", 
                      padding:"5px 15px", 
                      cursor:"pointer",
                      backgroundColor:"#4CAF50",
                      color:"white",
                      border:"none",
                      borderRadius:"4px"
                    }}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(item._id)}
                    style={{
                      padding:"5px 15px", 
                      cursor:"pointer",
                      backgroundColor:"#f44336",
                      color:"white",
                      border:"none",
                      borderRadius:"4px"
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
