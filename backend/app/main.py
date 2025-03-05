from functools import lru_cache
import json
import os
from typing import Dict, List, Union

import joblib
import numpy as np
import pandas as pd
import uvicorn
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# define the base directory and path to artifacts
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ARTIFACTS_DIR = os.path.join(BASE_DIR, "../artifacts")

app = FastAPI(title="Diabetes Readmission Predictor API")

origins = ["http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ModelArtifacts:

    def __init__(self):
        self.model = None
        self.preprocessor = None
        self.threshold = 0.5
        self.numeric_features = []
        self.categorical_features = []
        self._load_artifacts()

    def _load_artifacts(self):

        try:
            model_file = os.path.join(ARTIFACTS_DIR, "diabetes_readmission_model.pkl")
            transformer_file = os.path.join(ARTIFACTS_DIR, "preprocessing_transformer.pkl")
            config_file = os.path.join(ARTIFACTS_DIR, "model_config.json")
    
            self.model = joblib.load(f)

            self.preprocessor = joblib.load(f)

            with open(config_file) as f:
                model_config = json.load(f)
    
            self.threshold = model_config["threshold"]
            self.numeric_features = model_config["numeric_features"]
            self.categorical_features = model_config["categorical_features"]

        except FileNotFoundError as e:
            print(f"Model file not found: {e}")
            raise
        except json.JSONDecodeError as e:
            print(f"Invalid JSON data in config file: {e}")
            raise
        except Exception as e:
            print(f"Error loading model: {e}")
            raise

@lru_cache(maxsize=1)
def get_model_artifacts():
    return ModelArtifacts()

def apply_log_transformations(df: pd.DataFrame, numeric_features: List[str]) -> pd.DataFrame:
    """Log transform features containing a "_log" substring.

    Args:
        df (pd.DataFrame): A table containing columns with numeric data.
        numeric_features (List[str]): A list with some elements containing a "_log" suffix.

    Returns:
        pd.DataFrame: A table with certain columns containing log-tranformed data.
    """

    cols_to_log = [feat.replace("_log", "") for feat in numeric_features if "_log" in feat]
    for col in cols_to_log:
        if col in df.columns:
            df[f"{col}_log"] = np.log1p(df[col])
        else:
            print(f"Warning: Column {col} not found in input data.")

    return df

# define the expected input data
class PatientData(BaseModel):

    # numeric features
    age: int
    num_lab_procedures: int
    num_medications: int    # will be log-transformed
    num_procedures: int     # will be log-transformed
    number_diagnoses: int
    number_emergency: int   # will be log-transformed
    number_inpatient: int   # will be log-transformed
    time_in_hospital: int   # will be log-transformed

    # categorical features
    admission_type_id: int  # will be converted to str later
    diabetesMed: str
    discharge_disposition_def: str
    disease_class_1: str
    race: str

    class Config:
        schema_extra = {
            "example": {
                "age": 60,
                "num_lab_procedures": 40,
                "num_medications": 10,
                "num_procedures": 1,
                "number_diagnoses": 7,
                "number_emergency": 2,
                "number_inpatient": 1,
                "time_in_hospital": 4,
                "admission_type_id": 1,
                "diabetesMed": "Yes",
                "discharge_disposition_def": "home_routine",
                "disease_class_1": "Diseases of the Circulatory System",
                "race": "Caucasian"
            }
        }

# define the response model
class PredictionResponse(BaseModel):
    prediction: str
    probability: float
    risk_category: str

@app.post("/predict", response_model=PredictionResponse)
async def predict_readmission(
    patient:  PatientData,
    artifacts: ModelArtifacts = Depends(get_model_artifacts)) -> PredictionResponse:
    try:
        # convert the patient data to a dictionary then DF
        patient_dict = patient.model_dump()
        df = pd.DataFrame([patient_dict])

        # convert the admission type ID
        df["admission_type_id"]  = df["admission_type_id"].astype(str)

        # log transform relevant features
        df = apply_log_transformations(df, artifacts.numeric_features)

        # filter and order features to match model training,
        # assuming the order must match the training configuration
        features = [f for f in artifacts.numeric_features + artifacts.categorical_features if f in df.columns]
        df = df[features].copy()

        # apply preprocessing
        X_processed = artifacts.preprocessor.transform(df)

        # get the only probability estimate
        probability = float(artifacts.model.predict_proba(X_processed)[0, 1])

        # apply the threshold for predictions
        prediction = "Readmitted" if probability >= artifacts.threshold else "Not Readmitted"

        # determine the risk category
        if probability < 0.3:
            risk_category = "Low"
        elif probability < 0.6:
            risk_category = "Moderate"
        else:
            risk_category = "High"

        return PredictionResponse(
            prediction=prediction,
            probability=probability,
            risk_category=risk_category
        )

    except KeyError as e:
        raise HTTPException(status_code=400, detail=f"Missing feature: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@app.get("/health")
async def health_check(artifacts: ModelArtifacts = Depends(get_model_artifacts)) -> Dict[str, Union[str, bool]]:
    return {"status": "healthy", "model_loaded": artifacts.model is not None}

@app.get("/")
async def root() -> Dict[str, str]:
    return {"message": "Diabetes Readmission Predictor API"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
