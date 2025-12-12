const Form = require("../models/Form");

const submitForm = async (req, res, next) => {
  try {
    console.log("📩 Controller: Received Body:", req.body);
    console.log("📩 Controller: Request method:", req.method);
    console.log("📩 Controller: Request URL:", req.url);
    
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: "Request body is empty" });
    }
    
    console.log("📩 Creating Form model with data:", req.body);
    const data = new Form(req.body);
    
    console.log("📩 Attempting to save to database...");
    const saved = await data.save();
    console.log("✅ Form saved successfully:", saved);
    
    return res.json(saved);
  } catch (error) {
    console.error("❌ Error in submitForm:", error);
    console.error("❌ Error name:", error?.name);
    console.error("❌ Error message:", error?.message);
    console.error("❌ Error stack:", error?.stack);
    
    try {
      console.error("❌ Full error object:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
    } catch (e) {
      console.error("❌ Could not stringify error object");
    }
    
    // If response already sent, don't try to send again
    if (res.headersSent) {
      console.warn("⚠️ Response already sent, cannot send error response");
      return;
    }
    
    // Extract error message safely
    let errorMessage = "Internal server error";
    
    try {
      if (error?.message) {
        errorMessage = String(error.message);
      } else if (error?.errors && typeof error.errors === "object") {
        // Mongoose validation errors
        const errorMessages = Object.values(error.errors)
          .map((e) => e?.message || String(e))
          .filter(msg => msg);
        errorMessage = errorMessages.length > 0 ? errorMessages.join(", ") : "Validation error";
      } else if (typeof error === "string") {
        errorMessage = error;
      } else if (error?.toString && error.toString() !== "[object Object]") {
        errorMessage = error.toString();
      }
    } catch (parseError) {
      console.error("❌ Error parsing error message:", parseError);
      errorMessage = "Internal server error";
    }
    
    // Ensure errorMessage is always a string and not empty
    const finalErrorMessage = String(errorMessage || "Internal server error");
    
    console.error("❌ Sending error response:", finalErrorMessage);
    console.error("❌ Error type:", error?.name || "Unknown");
    
    try {
      return res.status(500).json({ 
        error: finalErrorMessage,
        type: error?.name || "Error"
      });
    } catch (sendError) {
      console.error("❌ Failed to send error response:", sendError);
      // Last resort - try to send plain text
      if (!res.headersSent) {
        res.status(500).send(finalErrorMessage);
      }
    }
  }
};

const getSubmissions = async (req, res, next) => {
  try {
    const forms = await Form.find();
    console.log("✅ Fetched forms:", forms.length);
    return res.json(forms);
  } catch (error) {
    console.error("❌ Error fetching:", error);
    console.error("❌ Error stack:", error?.stack);
    
    if (res.headersSent) {
      return next(error);
    }
    
    return res.status(500).json({ 
      error: error?.message || "Internal server error",
      type: error?.name || "Error"
    });
  }
};

// GET single form by ID
const getFormById = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log("📩 Fetching form with ID:", id);
    
    const form = await Form.findById(id);
    
    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }
    
    console.log("✅ Form found:", form);
    return res.json(form);
  } catch (error) {
    console.error("❌ Error fetching form by ID:", error);
    
    if (res.headersSent) {
      return next(error);
    }
    
    // Handle invalid MongoDB ObjectId
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid form ID" });
    }
    
    return res.status(500).json({ 
      error: error?.message || "Internal server error",
      type: error?.name || "Error"
    });
  }
};

// UPDATE form by ID
const updateForm = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log("📩 Updating form with ID:", id);
    console.log("📩 Update data:", req.body);
    
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: "Request body is empty" });
    }
    
    // Find and update the form
    const updatedForm = await Form.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true } // new: true returns updated document, runValidators validates the update
    );
    
    if (!updatedForm) {
      return res.status(404).json({ error: "Form not found" });
    }
    
    console.log("✅ Form updated successfully:", updatedForm);
    return res.json(updatedForm);
  } catch (error) {
    console.error("❌ Error updating form:", error);
    console.error("❌ Error name:", error?.name);
    console.error("❌ Error message:", error?.message);
    
    if (res.headersSent) {
      return next(error);
    }
    
    // Handle invalid MongoDB ObjectId
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid form ID" });
    }
    
    // Handle validation errors
    if (error.name === "ValidationError") {
      const errorMessages = Object.values(error.errors)
        .map((e) => e?.message || String(e))
        .filter(msg => msg);
      return res.status(400).json({ 
        error: errorMessages.join(", "),
        type: "ValidationError"
      });
    }
    
    return res.status(500).json({ 
      error: error?.message || "Internal server error",
      type: error?.name || "Error"
    });
  }
};

// DELETE form by ID
const deleteForm = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log("📩 Deleting form with ID:", id);
    
    const deletedForm = await Form.findByIdAndDelete(id);
    
    if (!deletedForm) {
      return res.status(404).json({ error: "Form not found" });
    }
    
    console.log("✅ Form deleted successfully:", deletedForm);
    return res.json({ 
      message: "Form deleted successfully",
      deletedForm 
    });
  } catch (error) {
    console.error("❌ Error deleting form:", error);
    console.error("❌ Error name:", error?.name);
    console.error("❌ Error message:", error?.message);
    
    if (res.headersSent) {
      return next(error);
    }
    
    // Handle invalid MongoDB ObjectId
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid form ID" });
    }
    
    return res.status(500).json({ 
      error: error?.message || "Internal server error",
      type: error?.name || "Error"
    });
  }
};

module.exports = { 
  submitForm, 
  getSubmissions, 
  getFormById, 
  updateForm, 
  deleteForm 
};

