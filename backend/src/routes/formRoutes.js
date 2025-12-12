const express = require("express");
const { 
  submitForm, 
  getSubmissions, 
  getFormById, 
  updateForm, 
  deleteForm 
} = require("../controllers/formController");

const router = express.Router();

// Async error wrapper
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
      console.error("❌ Route Error:", err);

      if (!res.headersSent) {
        res.status(500).json({
          error: err?.message || "Internal server error",
          type: err?.name || "Error"
        });
      } else {
        next(err);
      }
    });
  };
};

// BASE test route
router.get("/", (req, res) => {
  res.json({
    message: "Form Route API Running 🚀",
    endpoints: {
      create: "POST /api/form",
      get_all: "GET /api/form",
      get_one: "GET /api/form/:id",
      update: "PUT /api/form/:id",
      delete: "DELETE /api/form/:id"
    }
  });
});

// CRUD Routes
router.post("/form", asyncHandler(submitForm));
router.get("/form", asyncHandler(getSubmissions));
router.get("/form/:id", asyncHandler(getFormById));
router.put("/form/:id", asyncHandler(updateForm));
router.delete("/form/:id", asyncHandler(deleteForm));

module.exports = router;
