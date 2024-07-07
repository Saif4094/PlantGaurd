import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import os

import keras
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from keras.applications.vgg19 import VGG19, preprocess_input
from keras.layers import Dense, Flatten
from keras.models import Model
from keras.callbacks import ModelCheckpoint, EarlyStopping

import matplotlib
matplotlib.use('Agg')  # Use the 'Agg' backend for headless environments
import matplotlib.pyplot as plt

# Verify the number of images
num_images = len(os.listdir(r"E:\mini project\Plant-Disease-Detection-And-Prevention\Dataset\train"))
print(f"Number of training images: {num_images}")

# Data generators
train_datagen = ImageDataGenerator(zoom_range=0.5, shear_range=0.3, horizontal_flip=True, preprocessing_function=preprocess_input)
val_datagen = ImageDataGenerator(preprocessing_function=preprocess_input)

train = train_datagen.flow_from_directory(directory=r"E:\mini project\Plant-Disease-Detection-And-Prevention\Dataset\train", target_size=(256,256), batch_size=32)
val = val_datagen.flow_from_directory(directory=r"E:\mini project\Plant-Disease-Detection-And-Prevention\Dataset\valid", target_size=(256,256), batch_size=32)

# Model building
base_model = VGG19(input_shape=(256, 256, 3), include_top=False)

for layer in base_model.layers:
    layer.trainable = False

X = Flatten()(base_model.output)
X = Dense(units=4, activation='softmax')(X)
model = Model(base_model.input, X)

model.summary()

model.compile(optimizer='adam', loss=keras.losses.categorical_crossentropy, metrics=['accuracy'])

# Callbacks
es = EarlyStopping(monitor='val_accuracy', min_delta=0.01, patience=3, verbose=1)
mc = ModelCheckpoint(filepath=r"E:\mini project\New folder\modelTraining\best_model.h5", verbose=1, save_best_only=True)
cb = [es, mc]

# Model training for 20 epochs
his = model.fit(train, steps_per_epoch=8, epochs=12, verbose=1, callbacks=cb, validation_data=val, validation_steps=16)

# Plotting training history
h = his.history
plt.plot(h['accuracy'])
plt.plot(h['val_accuracy'], c="red")
plt.title("Accuracy vs Validation Accuracy")
plt.xlabel("Epochs")
plt.ylabel("Accuracy")
plt.legend(['Training Accuracy', 'Validation Accuracy'])
plt.savefig('accuracy_plot.png')  # Save the plot as a PNG file

plt.plot(h['loss'])
plt.plot(h['val_loss'], c="red")
plt.title("Loss vs Validation Loss")
plt.xlabel("Epochs")
plt.ylabel("Loss")
plt.legend(['Training Loss', 'Validation Loss'])
plt.savefig('loss_plot.png')  # Save the plot as a PNG file

# Check if the model file exists
file_path = r"E:\mini project\New folder\modelTraining\best_model.h5"
if os.path.exists(file_path):
    print("Model saved successfully.")
else:
    print("Model was not saved.")

# Loading and evaluating the model
if os.path.exists(file_path):
    from keras.models import load_model
    model = load_model(file_path)
    acc = model.evaluate(val, verbose=1)[1]
    print(f"The accuracy of your model is = {acc * 100} %")
else:
    print("The model file does not exist. Please check the training and saving process.")
















