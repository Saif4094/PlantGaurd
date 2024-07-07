from flask import Flask, jsonify
from prediction import getDataFromCSV

app = Flask(__name__)

@app.route('/getDataFromCSV/<productId>')
def get_data_from_csv(productId):
    result = getDataFromCSV(productId)
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)