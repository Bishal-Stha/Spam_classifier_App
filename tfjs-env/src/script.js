let model;
let wordIndex;
const MAX_LEN = 100;
const VOCAB_SIZE = 8000;

// Centralized UI elements
const ui = {
    btn: document.getElementById('predictBtn'),
    clear: document.getElementById('clearBtn'),
    status: document.getElementById('statusBadge'),
    input: document.getElementById('userInput'),
    result: document.getElementById('result'),
    resultCont: document.getElementById('resultContainer'),
    resultDesc: document.getElementById('resultDesc')
};

async function init() {
    try {
        console.log("Starting engine...");

        // 1. Load Model
        model = await tf.loadLayersModel('tfjs_model/model.json');
        console.log("Model loaded successfully");

        // 2. Load Tokenizer
        const response = await fetch('tokenizer.json');
        if (!response.ok) throw new Error("tokenizer.json not found");
        wordIndex = await response.json();
        console.log("Tokenizer loaded successfully");

        // 3. Update UI
        ui.status.innerText = "Engine Ready";
        ui.status.className = "absolute -top-3 -right-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-green-100 text-green-700 border border-green-200 shadow-sm";
        ui.btn.disabled = false;

        // Attach Listeners
        ui.btn.addEventListener('click', predict);
        ui.clear.addEventListener('click', resetApp);

    } catch (e) {
        console.error("Critical Failure:", e);
        ui.status.innerText = "System Offline";
        ui.status.className = "absolute -top-3 -right-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-red-100 text-red-700 border border-red-200 shadow-sm";
        ui.resultCont.classList.remove('hidden');
        ui.result.innerText = "ERROR";
        ui.result.className = "text-4xl font-bold tracking-tight text-red-500";
        ui.resultDesc.innerText = "Could not load AI files. Make sure the 'tfjs_model' folder and 'tokenizer.json' are inside your 'src' folder.";
    }
}

function preprocess(text) {
    let clean = text.toLowerCase().replace(/[^a-z\s]/g, '').trim();
    if (!clean) return null;
    let words = clean.split(/\s+/).filter(Boolean);
    if (words.length === 0) return null;

    // Constrain indices strictly within [0, VOCAB_SIZE - 1] to prevent Out-of-Bounds crash
    let sequence = words.map(word => {
        const idx = wordIndex[word];
        return (idx && idx < VOCAB_SIZE) ? idx : 1; // 1 represents <OOV> token
    });

    if (sequence.length > MAX_LEN) {
        sequence = sequence.slice(0, MAX_LEN);
    } else {
        while (sequence.length < MAX_LEN) sequence.push(0);
    }
    return tf.tensor2d([sequence]);
}

async function predict() {
    const text = ui.input.value.trim();
    if (!text) return;

    // Visual feedback
    ui.btn.innerText = "Processing Neural Nodes...";
    ui.btn.disabled = true;

    // Small delay to make it feel like "AI is thinking"
    await new Promise(r => setTimeout(r, 500));

    try {
        const inputTensor = preprocess(text);
        if (!inputTensor) {
            ui.resultCont.classList.remove('hidden');
            ui.result.innerText = "INVALID";
            ui.result.className = "text-4xl font-bold tracking-tight text-amber-500";
            ui.resultDesc.innerText = "Please provide a valid message containing alphabetic text.";
            return;
        }

        let score;
        try {
            // Wrap model prediction inside tf.tidy to avoid leaking intermediate tensors
            score = tf.tidy(() => {
                const prediction = model.predict(inputTensor);
                return prediction.dataSync()[0];
            });
        } finally {
            // Explicitly dispose input tensor to prevent WebGL memory leak
            inputTensor.dispose();
        }

        ui.resultCont.classList.remove('hidden');

        const isSpam = score >= 0.6; // 60% Threshold

        if (isSpam) {
            ui.result.innerText = "SPAM";
            ui.result.className = "text-5xl font-black tracking-tighter italic text-red-500";
            ui.resultDesc.innerText = "High-risk patterns detected. This message closely matches known fraudulent communication structures.";
        } else {
            ui.result.innerText = "LEGIT";
            ui.result.className = "text-5xl font-black tracking-tighter italic text-green-500";
            ui.resultDesc.innerText = "Message verified. No malicious intent or spam-like signatures were found by the neural engine.";
        }
    } catch (err) {
        console.error("Prediction error:", err);
        ui.resultCont.classList.remove('hidden');
        ui.result.innerText = "ERROR";
        ui.result.className = "text-4xl font-bold tracking-tight text-red-500";
        ui.resultDesc.innerText = "An error occurred during inference. The engine has been safely reset.";
    } finally {
        // Error boundary: ensure button state is always restored
        ui.btn.innerText = "Analyze Message";
        ui.btn.disabled = false;
    }
}

function resetApp() {
    ui.input.value = "";
    ui.resultCont.classList.add('hidden');
    ui.input.focus();
}

init();
