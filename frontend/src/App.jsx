import React from 'react'
import './App.css'
import PredictReadmissionForm from "./components/PredictReadmissionForm";

function App() {
  return (
    <main className="min-h-screen w-full bg-white flex flex-col items-center pt-8 m-12">
      <h1 className="text-4xl font-bold text-blue-600 mb-2">
        Diabetes Reamission Predictor
      </h1>
      <PredictReadmissionForm />
    </main>
  );
};

export default App
