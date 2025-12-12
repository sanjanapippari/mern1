import { BrowserRouter, Routes, Route } from "react-router-dom";
import FormPage from "./FormPage";
import ResultPage from "./ResultPage";
import EditFormPage from "./EditFormPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FormPage />} />
        <Route path="/results" element={<ResultPage />} />
        <Route path="/edit/:id" element={<EditFormPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
