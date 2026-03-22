import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppShell from "./components/AppShell";
import Home from "./pages/Home";
import CareerForm from "./pages/CareerForm";
import Dashboard from "./pages/Dashboard";
import Roadmap from "./pages/Roadmap";
import Confusion from "./pages/Confusion";
import MentorChat from "./pages/MentorChat";
import InterviewPrep from "./pages/InterviewPrep";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/form" element={<CareerForm />} />
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/results" element={<Navigate to="/dashboard" replace />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/confusion" element={<Confusion />} />
          <Route path="/mentor" element={<MentorChat />} />
          <Route path="/interview" element={<InterviewPrep />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
