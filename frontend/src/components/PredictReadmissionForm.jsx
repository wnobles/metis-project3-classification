import React, { useState } from "react";
import api from "../api";

function PredictReadmissionForm() {

    // set up fields needed by the model
    // You don't typically put json inside of a useState. Anytime you change anything in formData, anything that uses a value from formData has to re-render. It's more common to just breakout each item into its own piece of state.
    // Now adays, a more industry standard for form data is react-hook-forms: https://react-hook-form.com/
    const [formData, setFormData] = useState({
        age: 60,
        num_lab_procedures: 40,
        num_medications: 10,
        num_procedures: 1,
        number_diagnoses: 7,
        number_emergency: 2,
        number_inpatient: 1,
        time_in_hospital: 4,
        admission_type_id: 1,
        diabetesMed: "Yes",
        discharge_disposition_def: "home_routine",
        disease_class_1: "Diseases of the Circulatory System",
        race: "Caucasian"
    });

    // state to store the server's prediction result
    const [predictionResult, setPredictionResult] = useState(null);

    // state the handle any errors
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage("");
        setPredictionResult(null);
        //You could set a loading state here which you could use to disable the button so people don't spam the backend with requests.
        // IDK how long your code takes to run but if its more than like .5 seconds it'd be a good addition.

        try {
            // POST request to /predict
            const response = await api.post("/predict", formData);
            setPredictionResult(response.data);

        } catch (error) {
            console.error("Prediction error:", error);
            if (error.response) {
                // server responded with an error
                setErrorMessage(error.response.data.detail || "Server error");
            } else {
                // no response or something else happened
                setErrorMessage("An error occurred while making the request.");
            }
        } finally {
            // a good use for the finally piece for setting that loading state to false
        }
    };

    return (
        <div className="w-full max-w-md bg-white p-6 rounded text-black">
            <h2 className="text-2xl font-semibold mb-4 text-center">Patient Readmission</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Theres nothing wrong with rolling these components by yourself, especially while you learn. If you want some good looking components right out of the box that are customizeable a super popular library right now is ShadCN: https://ui.shadcn.com/  */}
                <div>
                    <label className="block font-medium mb-1">Age:</label>
                    <input
                    type="number"
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                </div>
                <div>
                    <label className="block font-medium mb-1">Number of Lab Procedures:</label>
                    <input
                    type="number"
                    id="num_lab_procedures"
                    name="num_lab_procedures"
                    value={formData.num_lab_procedures}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                </div>
                <div>
                    <label className="block font-medium mb-1">Number of Medications:</label>
                    <input
                    type="number"
                    id="num_medications"
                    name="num_medications"
                    value={formData.num_medications}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                </div>
                <div>
                    <label className="block font-medium mb-1">Number of Procedures:</label>
                    <input
                    type="number"
                    id="num_procedures"
                    name="num_procedures"
                    value={formData.num_procedures}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                </div>
                <div>
                    <label className="block font-medium mb-1">Number of Diagnoses:</label>
                    <input
                    type="number"
                    id="number_diagnoses"
                    name="number_diagnoses"
                    value={formData.number_diagnoses}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                </div>
                <div>
                    <label className="block font-medium mb-1">Number of Emergencies:</label>
                    <input
                    type="number"
                    id="number_emergency"
                    name="number_emergency"
                    value={formData.number_emergency}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                </div>
                <div>
                    <label className="block font-medium mb-1">Number of Inpatient Visits:</label>
                    <input
                    type="number"
                    id="number_inpatient"
                    name="number_inpatient"
                    value={formData.number_inpatient}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                </div>
                <div>
                    <label className="block font-medium mb-1">Time in Hospital:</label>
                    <input
                    type="number"
                    id="time_in_hospital"
                    name="time_in_hospital"
                    value={formData.time_in_hospital}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                </div>
                <div>
                    <label className="block font-medium mb-1">Admission Type ID:</label>
                    <input
                    type="number"
                    id="admission_type_id"
                    name="admission_type_id"
                    value={formData.admission_type_id}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                </div>
                <div>
                    <label className="block font-medium mb-1">Diabetes Medication:</label>
                    <select
                    name="diabetesMed"
                    value={formData.diabetesMed}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    >
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                    </select>
                </div>
                <div>
                    <label className="block font-medium mb-1">Discharge Disposition Definition:</label>
                    <select
                    name="discharge_disposition_def"
                    value={formData.discharge_disposition_def}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    >
                        <option value="admitted_inpatient">Admitted as Inpatient</option>
                        <option value="cancer_or_childrens">Cancer Center or Children's Hospital</option>
                        <option value="custodial_care">Custodial or Supportive Care</option>
                        <option value="home_routine">Home or Self-Care</option>
                        <option value="home_under_care">Home Under Care or Supervision</option>
                        <option value="left_ama">Left Against Medical Advice or Discontinued Care</option>
                        <option value="reserved">Reserved</option>
                        <option value="short_term_care">Short Term Care</option>
                        <option value="snf">Skilled Nursing Facility</option>
                    </select>
                </div>
                <div>
                    <label className="block font-medium mb-1">Disease Classification:</label>
                    <select
                    name="disease_class_1"
                    value={formData.disease_class_1}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    >
                        <option value="Certain Conditions originating in the Perinatal Period">Certain Conditions originating in the Perinatal Period</option>
                        <option value="Complications of Pregnancy, Childbirth, and the Puerperium">Complications of Pregnancy, Childbirth, and the Puerperium</option>
                        <option value="Congenital Anomalies">Congenital Anomalies</option>
                        <option value="Diabetes-Related">Diabetes-Related</option>
                        <option value="Diseases of the Blood and Blood-forming Organs">Diseases of the Blood and Blood-forming Organs</option>
                        <option value="Diseases of the Circulatory System">Diseases of the Circulatory System</option>
                        <option value="Diseases of the Digestive System">Diseases of the Digestive System</option>
                        <option value="Diseases of the Genitourinary System">Diseases of the Genitourinary System</option>
                        <option value="Diseases of the Musculoskeletal System and Connective Tissue">Diseases of the Musculoskeletal System and Connective Tissue</option>
                        <option value="Diseases of the Nervous System and Sense Organs">Diseases of the Nervous System and Sense Organs</option>
                        <option value="Diseases of the Respiratory System">Diseases of the Respiratory System</option>
                        <option value="Diseases of the Skin and Subcutaneous Tissue">Diseases of the Skin and Subcutaneous Tissue</option>
                        <option value="Endocrine, Nutritional and Metabolic Diseases, and Immunity Disorders">Endocrine, Nutritional and Metabolic Diseases, and Immunity Disorders</option>
                        <option value="Infectious and Parasitic Diseases">Infectious and Parasitic Diseases</option>
                        <option value="Injury and Poisoning">Injury and Poisoning</option>
                        <option value="Mental Disorders">Mental Disorders</option>
                        <option value="Neoplasms">Neoplasms</option>
                        <option value="Supplementary Classification of External Causes of Injury and Poisoning">Supplementary Classification of External Causes of Injury and Poisoning</option>
                        <option value="Supplementary Classification of Factors influencing Health Status and Contact with Health Services">Supplementary Classification of Factors influencing Health Status and Contact with Health Services</option>
                        <option value="Symptoms, Signs and Ill-defined Conditions">Symptoms, Signs and Ill-defined Conditions</option>
                    </select>
                </div>
                <div>
                    <label className="block font-medium mb-1">Race:</label>
                    <select
                    name="race"
                    value={formData.race}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    >
                        <option value="Asian">Asian</option>
                        <option value="AfricanAmerican">African American</option>
                        <option value="Caucasian">Caucasian</option>
                        <option value="Hispanic">Hispanic</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <button
                type="submit"
                className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                // you can use 'disabled={loading}' here when you add that loading variable to disable this while the network request is running. This also gives some sort of indication that your button press worked.
                >
                    Submit
                </button>
            </form>

            {/* Show error message, if any */}
            {errorMessage && <p className="text-red-600 text-center mt-4">{errorMessage}</p>}

            {/* Show prediction result, if available */}
            {predictionResult && (
                <div className="mt-6 text-center">
                    <h3 className="text-xl font-bold mb-2">Prediction Result</h3>
                    <p>Prediction: {predictionResult.prediction}</p>
                    <p>Probability: {predictionResult.probability}</p>
                    <p>Risk Category: {predictionResult.risk_category}</p>
                </div>
                )}
        </div>
    );
}

export default PredictReadmissionForm;
