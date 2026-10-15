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
    resultBadge: document.getElementById('resultBadge'),
    resultCont: document.getElementById('resultContainer'),
    resultDesc: document.getElementById('resultDesc'),
    idleState: document.getElementById('idleState'),
    confidenceVal: document.getElementById('confidenceVal'),
    confidenceBar: document.getElementById('confidenceBar'),
    charCount: document.getElementById('charCount'),
    latencyBadge: document.getElementById('latencyBadge')
};

async function init() {
    try {
        console.log("Starting neural engine...");

        // 1. Load Model
        model = await tf.loadLayersModel('tfjs_model/model.json');
        console.log("Model loaded successfully");

        // 2. Load Tokenizer
        const response = await fetch('tokenizer.json');
        if (!response.ok) throw new Error("tokenizer.json not found");
        wordIndex = await response.json();
        console.log("Tokenizer loaded successfully");

        // 3. Update Integrated Header Status Badge
        ui.status.className = "px-3 py-1.5 text-xs font-mono font-medium rounded-sm border bg-emerald-950/60 text-emerald-400 border-emerald-800/80 flex items-center gap-2";
        ui.status.innerHTML = '<span class="w-1.5 h-1.5 bg-emerald-400 rounded-none"></span><span>ENGINE READY</span>';
        ui.btn.disabled = false;

        // Attach Event Listeners
        ui.btn.addEventListener('click', predict);
        ui.clear.addEventListener('click', resetApp);
        ui.input.addEventListener('input', updateCounters);
        ui.input.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                if (!ui.btn.disabled) predict();
            }
        });

    } catch (e) {
        console.error("Critical Failure:", e);
        ui.status.className = "px-3 py-1.5 text-xs font-mono font-medium rounded-sm border bg-red-950/60 text-red-400 border-red-800/80 flex items-center gap-2";
        ui.status.innerHTML = '<span class="w-1.5 h-1.5 bg-red-400 rounded-none"></span><span>SYSTEM OFFLINE</span>';

        ui.idleState.classList.add('hidden');
        ui.resultCont.classList.remove('hidden');
        ui.result.innerText = "ERROR";
        ui.resultBadge.className = "p-4 rounded-sm border font-mono font-bold text-center text-2xl tracking-widest uppercase bg-red-950/60 border-red-800 text-red-400";
        ui.confidenceVal.innerText = "--";
        ui.confidenceBar.style.width = "0%";
        ui.resultDesc.innerText = "Could not initialize AI files. Verify 'tfjs_model' and 'tokenizer.json' are accessible.";
    }
}

function updateCounters() {
    const text = ui.input.value;
    const chars = text.length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    if (ui.charCount) {
        ui.charCount.innerText = `${chars} CHARS // ${words} TOKENS`;
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
    ui.btn.innerText = "EXECUTING INFERENCE...";
    ui.btn.disabled = true;

    const startTime = performance.now();

    try {
        const inputTensor = preprocess(text);
        if (!inputTensor) {
            ui.idleState.classList.add('hidden');
            ui.resultCont.classList.remove('hidden');
            ui.result.innerText = "INVALID";
            ui.resultBadge.className = "p-4 rounded-sm border font-mono font-bold text-center text-2xl tracking-widest uppercase bg-amber-950/60 border-amber-800 text-amber-400";
            ui.confidenceVal.innerText = "--";
            ui.confidenceBar.style.width = "0%";
            ui.resultDesc.innerText = "Payload contains no alphabetic tokens. Please provide readable text for analysis.";
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
            // Explicitly dispose input tensor to prevent WebGL GPU memory leak
            inputTensor.dispose();
        }

        const endTime = performance.now();
        const duration = Math.max(1, Math.round(endTime - startTime));
        if (ui.latencyBadge) {
            ui.latencyBadge.innerText = `${duration} MS`;
        }

        ui.idleState.classList.add('hidden');
        ui.resultCont.classList.remove('hidden');

        const isSpam = score >= 0.6; // 60% Threshold

        if (isSpam) {
            const spamPercentage = (score * 100).toFixed(1);
            ui.result.innerText = "SPAM";
            ui.resultBadge.className = "p-4 rounded-sm border font-mono font-bold text-center text-2xl tracking-widest uppercase bg-red-950/60 border-red-800 text-red-400";
            ui.confidenceVal.innerText = `${spamPercentage}%`;
            ui.confidenceVal.className = "text-red-400 font-bold font-mono";
            ui.confidenceBar.style.width = `${Math.min(100, Math.max(0, score * 100))}%`;
            ui.confidenceBar.className = "h-full bg-red-500 transition-all duration-300";
            ui.resultDesc.innerText = "High-risk spam signature detected. Input pattern closely matches known phishing, unsolicited advertising, or fraud communication.";
        } else {
            const legitPercentage = ((1 - score) * 100).toFixed(1);
            ui.result.innerText = "LEGIT";
            ui.resultBadge.className = "p-4 rounded-sm border font-mono font-bold text-center text-2xl tracking-widest uppercase bg-emerald-950/60 border-emerald-800 text-emerald-400";
            ui.confidenceVal.innerText = `${legitPercentage}%`;
            ui.confidenceVal.className = "text-emerald-400 font-bold font-mono";
            ui.confidenceBar.style.width = `${Math.min(100, Math.max(0, (1 - score) * 100))}%`;
            ui.confidenceBar.className = "h-full bg-emerald-500 transition-all duration-300";
            ui.resultDesc.innerText = "Message verified legitimate. Neural signature indicates benign, normal conversational patterns with no threat detected.";
        }
    } catch (err) {
        console.error("Prediction error:", err);
        ui.idleState.classList.add('hidden');
        ui.resultCont.classList.remove('hidden');
        ui.result.innerText = "ERROR";
        ui.resultBadge.className = "p-4 rounded-sm border font-mono font-bold text-center text-2xl tracking-widest uppercase bg-red-950/60 border-red-800 text-red-400";
        ui.confidenceVal.innerText = "--";
        ui.confidenceBar.style.width = "0%";
        ui.resultDesc.innerText = "An error occurred during inference. The engine has been safely reset.";
    } finally {
        ui.btn.innerText = "Execute Analysis";
        ui.btn.disabled = false;
    }
}

function resetApp() {
    ui.input.value = "";
    updateCounters();
    if (ui.latencyBadge) ui.latencyBadge.innerText = "-- MS";
    ui.resultCont.classList.add('hidden');
    ui.idleState.classList.remove('hidden');
    ui.input.focus();
}

init();
