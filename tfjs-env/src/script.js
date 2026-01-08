// // let model;
// // let wordIndex;
// // const MAX_LEN = 100;

// // const ui = {
// //     btn: document.getElementById('predictBtn'),
// //     status: document.getElementById('statusBadge'),
// //     input: document.getElementById('userInput'),
// //     result: document.getElementById('result'),
// //     resultCont: document.getElementById('resultContainer'),
// //     resultDesc: document.getElementById('resultDesc')
// // };

// // async function init() {
// //     try {
// //         model = await tf.loadLayersModel('tfjs_model/model.json');
// //         const response = await fetch('tokenizer.json');
// //         wordIndex = await response.json();

// //         // Update UI state
// //         ui.status.innerText = "Engine Ready";
// //         ui.status.classList.replace('bg-gray-200', 'bg-green-100');
// //         ui.status.classList.replace('text-gray-500', 'text-green-600');
// //         ui.btn.disabled = false;

// //         // Add click listener
// //         ui.btn.addEventListener('click', predict);
// //     } catch (e) {
// //         ui.status.innerText = "Offline";
// //         ui.status.classList.add('bg-red-100', 'text-red-600');
// //         console.error("Init Error:", e);
// //     }
// // }

// // function preprocess(text) {
// //     let clean = text.toLowerCase().replace(/[^a-z\s]/g, '').trim();
// //     let words = clean.split(/\s+/);
// //     let sequence = words.map(word => wordIndex[word] || 1);

// //     if (sequence.length > MAX_LEN) {
// //         sequence = sequence.slice(0, MAX_LEN);
// //     } else {
// //         while (sequence.length < MAX_LEN) sequence.push(0);
// //     }
// //     return tf.tensor2d([sequence]);
// // }

// // async function predict() {
// //     const text = ui.input.value.trim();
// //     if (!text) return;

// //     // Loading state
// //     ui.btn.innerText = "Analyzing Patterns...";
// //     ui.btn.classList.add('opacity-80');

// //     // Artificial delay for "Premium" feel (optional)
// //     await new Promise(r => setTimeout(r, 600));

// //     const inputTensor = preprocess(text);
// //     const prediction = model.predict(inputTensor);
// //     const scoreData = await prediction.data();
// //     const score = scoreData[0];

// //     // Show Result Container
// //     ui.resultCont.classList.remove('hidden');

// //     const isSpam = score >= 0.6; // Your 60% threshold

// //     if (isSpam) {
// //         ui.result.innerText = "SPAM";
// //         ui.result.className = "text-5xl font-black italic text-red-500";
// //         ui.resultDesc.innerText = "Caution: This message exhibits high-probability spam characteristics.";
// //     } else {
// //         ui.result.innerText = "LEGIT";
// //         ui.result.className = "text-5xl font-black italic text-green-500";
// //         ui.resultDesc.innerText = "Safe: No malicious intent or spam patterns detected.";
// //     }

// //     // Restore button
// //     ui.btn.innerText = "Analyze Message";
// //     ui.btn.classList.remove('opacity-80');
// // }

// // function resetApp() {
// //     ui.input.value = "";
// //     ui.resultCont.classList.add('hidden');
// //     ui.input.focus();
// // }

// // init();

// let model;
// let wordIndex;
// const MAX_LEN = 100;

// // Centralized UI elements
// const ui = {
//     btn: document.getElementById('predictBtn'),
//     clear: document.getElementById('clearBtn'),
//     status: document.getElementById('statusBadge'),
//     input: document.getElementById('userInput'),
//     result: document.getElementById('result'),
//     resultCont: document.getElementById('resultContainer'),
//     resultDesc: document.getElementById('resultDesc')
// };

// async function init() {
//     try {
//         console.log("Starting engine...");

//         // 1. Load Model
//         model = await tf.loadLayersModel('tfjs_model/model.json');
//         console.log("Model loaded successfully");

//         // 2. Load Tokenizer
//         const response = await fetch('tokenizer.json');
//         if (!response.ok) throw new Error("tokenizer.json not found");
//         wordIndex = await response.json();
//         console.log("Tokenizer loaded successfully");

//         // 3. Update UI
//         ui.status.innerText = "Engine Ready";
//         ui.status.className = "absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-green-100 text-green-600 border border-green-200";
//         ui.btn.disabled = false;

//         // Attach Listeners
//         ui.btn.addEventListener('click', predict);
//         ui.clear.addEventListener('click', resetApp);

//     } catch (e) {
//         console.error("Critical Failure:", e);
//         ui.status.innerText = "System Offline";
//         ui.status.className = "absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-red-100 text-red-600 border border-red-200";
//         ui.resultCont.classList.remove('hidden');
//         ui.result.innerText = "ERROR";
//         ui.resultDesc.innerText = "Could not load AI files. Make sure the 'tfjs_model' folder and 'tokenizer.json' are inside your 'src' folder.";
//     }
// }

// function preprocess(text) {
//     let clean = text.toLowerCase().replace(/[^a-z\s]/g, '').trim();
//     let words = clean.split(/\s+/);
//     let sequence = words.map(word => wordIndex[word] || 1);

//     if (sequence.length > MAX_LEN) {
//         sequence = sequence.slice(0, MAX_LEN);
//     } else {
//         while (sequence.length < MAX_LEN) sequence.push(0);
//     }
//     return tf.tensor2d([sequence]);
// }

// async function predict() {
//     const text = ui.input.value.trim();
//     if (!text) return;

//     // Visual feedback
//     ui.btn.innerText = "Processing Neural Nodes...";
//     ui.btn.disabled = true;

//     // Small delay to make it feel like "AI is thinking"
//     await new Promise(r => setTimeout(r, 500));

//     try {
//         const inputTensor = preprocess(text);
//         const prediction = model.predict(inputTensor);
//         const scoreData = await prediction.data();
//         const score = scoreData[0];

//         ui.resultCont.classList.remove('hidden');

//         const isSpam = score >= 0.6; // 60% Threshold

//         if (isSpam) {
//             ui.result.innerText = "SPAM";
//             ui.result.className = "text-5xl font-black tracking-tighter italic text-red-500";
//             ui.resultDesc.innerText = "High-risk patterns detected. This message closely matches known fraudulent communication structures.";
//         } else {
//             ui.result.innerText = "LEGIT";
//             ui.result.className = "text-5xl font-black tracking-tighter italic text-green-500";
//             ui.resultDesc.innerText = "Message verified. No malicious intent or spam-like signatures were found by the neural engine.";
//         }
//     } catch (err) {
//         console.error("Prediction error:", err);
//     }

//     ui.btn.innerText = "Analyze Message";
//     ui.btn.disabled = false;
// }

// function resetApp() {
//     ui.input.value = "";
//     ui.resultCont.classList.add('hidden');
//     ui.input.focus();
// }

// init();

let model;
let wordIndex;
const MAX_LEN = 100;

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
        ui.status.className = "absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-green-100 text-green-600 border border-green-200";
        ui.btn.disabled = false;

        // Attach Listeners
        ui.btn.addEventListener('click', predict);
        ui.clear.addEventListener('click', resetApp);

    } catch (e) {
        console.error("Critical Failure:", e);
        ui.status.innerText = "System Offline";
        ui.status.className = "absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-red-100 text-red-600 border border-red-200";
        ui.resultCont.classList.remove('hidden');
        ui.result.innerText = "ERROR";
        ui.resultDesc.innerText = "Could not load AI files. Make sure the 'tfjs_model' folder and 'tokenizer.json' are inside your 'src' folder.";
    }
}

function preprocess(text) {
    let clean = text.toLowerCase().replace(/[^a-z\s]/g, '').trim();
    let words = clean.split(/\s+/);
    let sequence = words.map(word => wordIndex[word] || 1);

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
        const prediction = model.predict(inputTensor);
        const scoreData = await prediction.data();
        const score = scoreData[0];

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
    }

    ui.btn.innerText = "Analyze Message";
    ui.btn.disabled = false;
}

function resetApp() {
    ui.input.value = "";
    ui.resultCont.classList.add('hidden');
    ui.input.focus();
}

init();