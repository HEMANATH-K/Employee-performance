from flask import Flask, request, jsonify
import joblib
import numpy as np

app = Flask(__name__)

# Load the trained model and scaler
model = joblib.load("INX_Future_Inc.pkl")
scaler = joblib.load("scaler.pkl")  # Load the same scaler used in training

@app.route('/')
def home():
    return "Welcome to the Employee Performance Prediction API!"

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()  # Get JSON data from request
    features = np.array([data['features']])  # Convert to NumPy array
    
    # Transform input using the trained scaler
    scaled_features = scaler.transform(features)

    # Get prediction
    prediction = model.predict(scaled_features)
    
    return jsonify({"prediction": prediction.tolist()})

if __name__ == '__main__':
    app.run(debug=True)
