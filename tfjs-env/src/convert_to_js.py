import sys
from unittest.mock import MagicMock
import os

# 1. Trick Python into ignoring the broken decision forests library
sys.modules["tensorflow_decision_forests"] = MagicMock()

import tensorflowjs as tfjs
import tensorflow as tf

# 2. Path Check (Since you are inside the 'src' folder)
model_name = 'spam_model.h5'
output_folder = 'tfjs_model'

if os.path.exists(model_name):
    print(f"✅ Found {model_name}. Starting conversion...")
    
    # Load the model
    model = tf.keras.models.load_model(model_name)
    
    # Convert and save
    tfjs.converters.save_keras_model(model, output_folder)
    
    print(f"🎉 Success! The folder '{output_folder}' has been created.")
    print("Refresh your VS Code sidebar to see it.")
else:
    print(f"❌ Error: Still can't find '{model_name}' in the current folder.")
    print(f"Current folder is: {os.getcwd()}")