from flask import Flask, request, jsonify
import joblib
import numpy as np

app = Flask(__name__)

# Load the trained model and scaler
model = joblib.load('INX_Future_Inc.pkl')
scaler = joblib.load('scaler.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json['features']  # Expecting a list of numbers
    data = np.array(data).reshape(1, -1)  # Convert to numpy array
    scaled_data = scaler.transform(data)  # Apply scaling
    prediction = model.predict(scaled_data)  # Get prediction
    return jsonify({'prediction': int(prediction[0])})

if __name__ == '__main__':
    app.run(debug=True)
