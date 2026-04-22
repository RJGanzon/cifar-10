import tensorflow as tf
import numpy as np 

import keras

#Load the dataset
(X_train, y_train), (X_test, y_test) = keras.datasets.cifar10.load_data()

#Initialization of class_names
class_names = ['airplane', 'automobile', 'bird', 'cat', 'deer', 'dog', 'frog', 'horse', 'ship', 'truck']

#Make highest value of the pixel color of X = 1
X_train = X_train / 255.0
X_test = X_test / 255.0

model = keras.models.Sequential()

#Adding the layers to the model

#CNN
    #First Layer
model.add(keras.layers.Conv2D(filters=32, kernel_size=3, padding='same', activation="relu", input_shape=[32, 32, 3]))

    #Second Layer
model.add(keras.layers.Conv2D(filters=32, kernel_size=3, padding='same', activation="relu"))
model.add(keras.layers.MaxPool2D(pool_size=2, strides=2, padding='valid'))

    #Third Layer
model.add(keras.layers.Conv2D(filters=64, kernel_size=3, padding="same", activation="relu"))

    #Fourth Layer
model.add(keras.layers.Conv2D(filters=64, kernel_size=3, padding="same", activation="relu"))
model.add(keras.layers.MaxPool2D(pool_size=2, strides=2, padding='valid'))

    #Flatten Layer
model.add(keras.layers.Flatten())


#Dense

    #First
model.add(keras.layers.Dense(units=128, activation="relu"))

    #Second Layer (Output)
model.add(keras.layers.Dense(units=10, activation="softmax"))

#Model Summary
model.summary()

#Model Compilation
model.compile(loss="sparse_categorical_crossentropy", optimizer="Adam", metrics=["sparse_categorical_accuracy"])

#Model Train
model.fit(X_train, y_train, epochs=5)
model.save("cnn_cifar_10.keras")

#Evaluation and Prediction
test_loss, test_accuracy = model.evaluate(X_test, y_test)

print("Test accuracy" + format(test_accuracy))
