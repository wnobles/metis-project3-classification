import React, { useState } from 'react'
import './App.css'
import PredictReadmissionForm from "./components/PredictReadmissionForm";

function App() {
  return (
    <div>
      <h1>Diabetes Reamission Predictor</h1>
      <PredictReadmissionForm />
    </div>
  );
};

export default App
