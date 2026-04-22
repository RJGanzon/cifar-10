import tensorflow as tf
from flask import Flask, request, jsonify
import keras
from PIL import Image
import numpy as np


model = keras.models.load_model('../cnn_cifar_10.keras')

app = Flask(__name__)

@app.route('/')
def hello_world():
    return("Hello world")

@app.route('/post/predict-type', methods= ["POST"])
def predictImage():
    data = request.json
    prediction = checkClass(data['img_url'])
    return(jsonify({'prediction': prediction.tolist()}))


def checkClass(url):

    #Image Preprocessing
    image = Image.open(url).convert("RGB")
    image = image.resize((32, 32))
    img_array = np.array(image, dtype=np.float32)
    img_array = img_array / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    return model.predict(img_array)

