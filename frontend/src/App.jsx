import React, { useState } from 'react'
import './App.css'
import PredictReadmissionForm from "./components/PredictReadmissionForm";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-8">
      <h1 className="text-4xl font-bold text-blue-600 mb-2">
        Diabetes Reamission Predictor
      </h1>
      <PredictReadmissionForm />
    </div>
  );
};

export default App
