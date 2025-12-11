import pandas as pd
import pickle
import os
from pymongo import MongoClient
import numpy as np
from sklearn.preprocessing import StandardScaler

# Connect to MongoDB
client = MongoClient('mongodb+srv://dipikadeepsikha:Dip%40employee1@cluster1.cydtcao.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1')
db = client['employee_performance']

# Load the Excel file
excel_path = '../data/raw/INX_Future_Inc_Employee_Performance_CDS_Project2_Data_V1.8.xls'
print("Loading Excel file...")
df = pd.read_excel(excel_path)
print("Excel file loaded. Columns:", df.columns.tolist())

# Process and clean the data
def process_employee_data(df):
    # Map employee data to our schema
    employees = []
    performances = []
    
    for _, row in df.iterrows():
        # Print first row for debugging
        if len(employees) == 0:
            print("Sample row:", row.to_dict())
        
        employee = {
            'name': str(row['EmpNumber']),
            'department': str(row['EmpDepartment']),
            'role': str(row['EmpJobRole']),
            'salary': float(row['EmpHourlyRate']) * 2080  # Converting hourly rate to annual salary (40 hours/week * 52 weeks)
        }
        
        performance = {
            'employeeName': employee['name'],
            'kpiScore': float(row['PerformanceRating']) * 20,  # Converting 1-5 scale to percentage
            'attendance': 100 - (float(row['BusinessTravelFrequency'] == 'Travel_Frequently') * 10),  # Estimating attendance based on travel frequency
            'peerReview': float(row['EmpRelationshipSatisfaction']) * 20,  # Converting 1-5 scale to percentage
            'date': pd.Timestamp.now()
        }
        
        employees.append(employee)
        performances.append(performance)
    
    return employees, performances

# Load ML model and scaler
def load_ml_models():
    with open('../data/models/INX_Future_Inc.pkl', 'rb') as f:
        model = pickle.load(f)
    with open('../data/models/scaler.pkl', 'rb') as f:
        scaler = pickle.load(f)
    return model, scaler

def main():
    print("Processing data...")
    
    # Process Excel data
    employees, performances = process_employee_data(df)
    
    # Clear existing collections
    db.employees.delete_many({})
    db.performances.delete_many({})
    
    # Insert processed data
    if employees:
        db.employees.insert_many(employees)
        print(f"Inserted {len(employees)} employee records")
    
    if performances:
        db.performances.insert_many(performances)
        print(f"Inserted {len(performances)} performance records")
    
    # Load and verify ML models
    try:
        model, scaler = load_ml_models()
        print("ML models loaded successfully")
        
        # Test prediction on sample data
        sample = df.iloc[0]
        features = np.array([[
            sample['KPIscore'],
            sample['Attendance'],
            sample['PeerScore']
        ]])
        
        scaled_features = scaler.transform(features)
        prediction = model.predict(scaled_features)
        print(f"Sample prediction successful: {prediction[0]:.2f}")
        
    except Exception as e:
        print(f"Error loading ML models: {str(e)}")

if __name__ == "__main__":
    main() 