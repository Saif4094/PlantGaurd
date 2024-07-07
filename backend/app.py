from flask import Flask, request, jsonify
from keras.models import load_model
import numpy as np
from tensorflow.keras.preprocessing.image import load_img, img_to_array
from keras.applications.vgg19 import preprocess_input
import json
import os
import pandas as pd
import time
import sys

baseDir = r'C:\Users\ADMIN\Desktop\PlantGaurd\backend'

# Load the model
model = load_model(os.path.join(baseDir, 'best_model.h5'))

# Load additional data
dbDir = r'C:\Users\ADMIN\Desktop\PlantGaurd\backend'
data = json.load(open(os.path.join(baseDir, 'datafile.json')))
databaseDir = os.path.join(dbDir, 'data_files')
df = pd.read_csv(open(os.path.join(databaseDir, "supplement_info.csv")))

def prediction(path):
    try:
        img = load_img(path, target_size=(256, 256))
        i = img_to_array(img)
        im = preprocess_input(i)
        img = np.expand_dims(im, axis=0)
    except Exception as e:
        return {"error": str(e)}

    try:
        start_time = time.time()
        pred = np.argmax(model.predict(img))
        end_time = time.time()
        value = data[str(pred)]

        matching_rows = df.loc[df['disease_name'] == value]
        if matching_rows.empty:
            return {"error": "No matching disease found in the dataset."}
        
        return {"product_id": matching_rows.values[0][0]}
    
    except KeyError as e:
        return {"error": str(e)}

def getDataFromCSV(index):
    if df.shape[0] > index:
        return df.loc[df['index'] == index].values[0]
    else:
        return []

app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"})
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"})
    
    file_path = os.path.join(baseDir, file.filename)
    file.save(file_path)

    result = prediction(file_path)
    if "error" in result:
        return jsonify(result)

    product_id = result["product_id"]
    data = getDataFromCSV(product_id)
    result = {
        "product_id": product_id,
        "disease_name": data[1],
        "supplement_name": data[2],
        "supplement_image": data[3],
        "buy_link": data[4]
    }
    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True,port=8000)
