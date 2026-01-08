# SentryAI - Advanced Spam Classification Engine

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TensorFlow.js](https://img.shields.io/badge/ML-TensorFlow.js-orange.svg)
![Status](https://img.shields.io/badge/status-Live-green.svg)

**SentryAI** is a state-of-the-art, client-side spam detection tool powered by Deep Learning. By leveraging **TensorFlow.js**, it runs the neural network model directly in your browser, ensuring your data never leaves your device while providing instant, real-time analysis.

🚀 **[View Live Demo](https://spamclassifier.vercel.app/)**

---

## 🌟 Key Features

*   **Privacy-First Architecture**: All processing happens locally on your device using WebGL acceleration. No server-side inference means your messages stay private.
*   **Deep Learning Model**: Utilizes a Keras-trained neural network converted for the web, capable of understanding context beyond simple keyword matching.
*   **Modern UI/UX**: Features a "SentryAI" glassmorphism interface built with TailwindCSS for a premium, responsive experience.
*   **Instant Feedback**: Real-time tokenization and probability scoring.

## 🛠️ Technology Stack

*   **Core**: HTML5, Vanilla JavaScript (ES6+)
*   **Machine Learning**: TensorFlow (Keras) & TensorFlow.js
*   **Styling**: TailwindCSS (CDN), Custom CSS Variables
*   **Deployment**: Vercel

## 📂 Project Structure

```bash
ml_model_in_tensorflow/
├── tfjs-env/
│   └── src/
│       ├── index.html          # Main application interface
│       ├── script.js           # Inference logic & UI state management
│       ├── style.css           # Custom styling overrides
│       ├── spam_model.h5       # Original Keras model (for reference)
│       ├── tokenizer.json      # Word-to-index vocabulary
│       ├── convert_to_js.py    # Utility to convert Keras .h5 -> TFJS
│       └── tfjs_model/         # The converted web-ready model artifacts
│           ├── model.json
│           └── group1-shard1of1.bin
└── README.md
```

## 🚀 Getting Started Locally

To run this project on your local machine:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/ml_model_in_tensorflow.git
    cd ml_model_in_tensorflow
    ```

2.  **Navigate to the source:**
    ```bash
    cd tfjs-env/src
    ```

3.  **Start a local server:**
    Because of CORS (Cross-Origin Resource Sharing) security policies, you cannot simply open `index.html` file directly. You must serve it.
    
    *Using Python:*
    ```bash
    python -m http.server 8000
    ```
    
    *Using Node.js (http-server):*
    ```bash
    npx http-server .
    ```
    
    *Using VS Code:*
    Open `index.html` and click "Go Live" (requires Live Server extension).

4.  **Open in Browser:**
    Navigate to `http://localhost:8000`.

## 🧠 Model Conversion Workflow

If you want to train your own model and update the web app:

1.  Train your model in Python using TensorFlow/Keras.
2.  Save it as `my_model.h5`.
3.  Use the included script or the command line to convert it:
    ```bash
    tensorflowjs_converter --input_format keras my_model.h5 tfjs_model
    ```
4.  Ensure you also export the `tokenizer` as a JSON file so the web app maps words to integers correctly.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---
*Built with ❤️ using TensorFlow.js*
