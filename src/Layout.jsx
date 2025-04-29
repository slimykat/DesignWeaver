import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import App from "./App.jsx";
import App_baseline from "./App_baseline.jsx";
import Start from "./Start.jsx";
import DesignRequirement from "./components/DesignRequirement.jsx";
import PostExpSurvey from "./components/PostExpSurvey.jsx";
import ToolInstruction from "./components/ToolInstruction.jsx";
import Evaluation from "./components/Evaluation.jsx";

function Entry() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/Start" />} />
        <Route path="Start" element={<Start />} />
        <Route path="DesignRequirement" element={<DesignRequirement />} />
        <Route path="ToolInstruction" element={<ToolInstruction />} />
        <Route path="Interface" element={<App />} />
        <Route path="Application" element={<App_baseline />} />
        <Route path="Evaluation" element={<Evaluation />} />
        <Route path="PostExpSurvey" element={<PostExpSurvey />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Entry;
