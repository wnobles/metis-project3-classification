# Diabetes Readmission Predictor

A full-stack web application leveraging machine learning to predict early readmission for diabetes patients.

## Project Overview

This application utilizes a fine-tuned XGBoost classifier to determine whether a diabetic patient will be readmitted to the hospital within 30 days of their last discharge. It also categorizes a patient's risk (low, moderate, high) for readmission to provide actionable insights to healthcare providers.

### Key Features

* Prediction model: XGBoost classifier trained on the UCI Diabetes 130 dataset.
* REST API: FastAPI backend exposing prediction endpoints.
* Interactive UI: React frontent with intuitive form for patient data input.
* Risk assessment: Automatically categorizes patients into risk groups for early readmission.

## Technologies

### Backend
- **Language**: Python
- **Framework**: FastAPI
- **Machine Learning**: XGBoost, Scikit-Learn
- **Data Processing**: NumPy, Pandas

### Frontend
- **Framework**: React (built with Vite)
- **HTTP Client**: Axios
- **Styling**: CSS

## Getting Started

### Prerequisites
- **Backend**: Python 3.12+
- **Frontend**: Node.js (Latest LTS recommended)

### Installation

#### Backend
1. Navigate to the `backend/` directory.
2. Create and activate a virtual environment.
3. Install dependencies:
```bash
    pip install -r requirements.txt
```
4. Ensure the model artifacts (e.g., XGBoost model, preprocessing transformer, configuration JSON) are all located in the correct directory.

#### Frontend
1. Navigate to the `frontend/` directory.
2. Install dependencies:
```bash
    npm install
```

### Running the Application

#### Backend
Start the FastAPI server:
```bash
    python app/main.py
```

#### Frontend
Start the development server:
```bash
    npm run dev
```
Next, open the browser at the provided URL (typically <http://localhost:5173>).

## Data Source

This project uses the [Diabetes 130-US Hospitals for Years 1999-2008](https://archive.ics.uci.edu/dataset/296/diabetes+130-us+hospitals+for+years+1999-2008) maintained by UCI, which includes over 100,000 rows representing patient records at U.S. hospitals and integrated delivery networks.
