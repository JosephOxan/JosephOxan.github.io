// Global variables
let batteryData = null;
let trainedModel = null;
let chart = null;

// DOM elements
const fileInput = document.getElementById('fileInput');
const uploadArea = document.getElementById('uploadArea');
const fileInfo = document.getElementById('fileInfo');
const trainButton = document.getElementById('trainButton');
const modelSelect = document.getElementById('modelSelect');
const trainSplit = document.getElementById('trainSplit');
const trainSplitValue = document.getElementById('trainSplitValue');
const resultsSection = document.getElementById('resultsSection');
const loadingSpinner = document.getElementById('loadingSpinner');

// Event listeners
fileInput.addEventListener('change', handleFileSelect);
uploadArea.addEventListener('click', () => fileInput.click());
uploadArea.addEventListener('dragover', handleDragOver);
uploadArea.addEventListener('drop', handleDrop);
trainButton.addEventListener('click', trainModel);
trainSplit.addEventListener('input', (e) => {
    trainSplitValue.textContent = e.target.value + '%';
});
document.getElementById('downloadButton').addEventListener('click', downloadResults);

// File handling
function handleDragOver(e) {
    e.preventDefault();
    uploadArea.classList.add('dragover');
}

function handleDrop(e) {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        processFile(files[0]);
    }
}

function handleFileSelect(e) {
    const files = e.target.files;
    if (files.length > 0) {
        processFile(files[0]);
    }
}

async function processFile(file) {
    if (file.size > 10 * 1024 * 1024) {
        alert('File size exceeds 10MB limit!');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            let data;
            if (file.name.endsWith('.json')) {
                data = JSON.parse(e.target.result);
            } else if (file.name.endsWith('.csv')) {
                data = parseCSV(e.target.result);
            } else {
                alert('Unsupported file format!');
                return;
            }

            batteryData = data;
            displayFileInfo(file, data);
            displayDataPreview(data);
            trainButton.disabled = false;
        } catch (error) {
            alert('Error parsing file: ' + error.message);
        }
    };
    reader.readAsText(file);
}

function parseCSV(csvText) {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const data = [];

    for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim() === '') continue;
        const values = lines[i].split(',');
        const row = {};
        headers.forEach((header, index) => {
            row[header] = isNaN(values[index]) ? values[index] : parseFloat(values[index]);
        });
        data.push(row);
    }

    return data;
}

function displayFileInfo(file, data) {
    document.getElementById('fileName').textContent = file.name;
    document.getElementById('fileSize').textContent = (file.size / 1024).toFixed(2) + ' KB';
    document.getElementById('recordCount').textContent = data.length;
    fileInfo.style.display = 'block';
}

function displayDataPreview(data) {
    const table = document.getElementById('dataTable');
    const thead = document.getElementById('tableHead');
    const tbody = document.getElementById('tableBody');

    // Clear previous data
    thead.innerHTML = '';
    tbody.innerHTML = '';

    if (data.length === 0) return;

    // Create header
    const headerRow = document.createElement('tr');
    const headers = Object.keys(data[0]);
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);

    // Create rows (show first 10)
    const previewData = data.slice(0, 10);
    previewData.forEach(row => {
        const tr = document.createElement('tr');
        headers.forEach(header => {
            const td = document.createElement('td');
            const value = row[header];
            td.textContent = typeof value === 'number' ? value.toFixed(4) : value;
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
}

// Model training
async function trainModel() {
    loadingSpinner.style.display = 'flex';
    
    try {
        const splitRatio = parseInt(trainSplit.value) / 100;
        const modelType = modelSelect.value;
        
        // Prepare data
        const { trainData, testData } = splitData(batteryData, splitRatio);
        
        // Train based on model type
        let results;
        if (modelType === 'lstm') {
            results = await trainLSTM(trainData, testData);
        } else {
            results = await trainClassicML(trainData, testData, modelType);
        }
        
        displayResults(results);
    } catch (error) {
        alert('Error training model: ' + error.message);
        console.error(error);
    } finally {
        loadingSpinner.style.display = 'none';
    }
}

function splitData(data, splitRatio) {
    const splitIndex = Math.floor(data.length * splitRatio);
    return {
        trainData: data.slice(0, splitIndex),
        testData: data.slice(splitIndex)
    };
}

// Simple ML implementation (Random Forest approximation)
async function trainClassicML(trainData, testData, modelType) {
    // Extract features and labels
    const features = ['voltage_measured', 'current_measured', 'temperature_measured', 'time'];
    const target = 'capacity';
    
    // Normalize data
    const { normalizedTrain, normalizedTest, scaler } = normalizeData(trainData, testData, features);
    
    // Simple ensemble prediction (simulating Random Forest/AdaBoost/GradientBoost)
    const predictions = [];
    const actual = [];
    
    for (let i = 0; i < testData.length; i++) {
        const testPoint = normalizedTest[i];
        const nearestNeighbors = findNearestNeighbors(testPoint, normalizedTrain, 5);
        const prediction = nearestNeighbors.reduce((sum, idx) => sum + trainData[idx][target], 0) / nearestNeighbors.length;
        predictions.push(prediction);
        actual.push(testData[i][target]);
    }
    
    // Calculate metrics
    const metrics = calculateMetrics(actual, predictions);
    
    return {
        predictions,
        actual,
        metrics,
        testData
    };
}

// LSTM implementation using TensorFlow.js
async function trainLSTM(trainData, testData) {
    const features = ['voltage_measured', 'current_measured', 'temperature_measured'];
    const target = 'capacity';
    
    // Prepare sequences
    const sequenceLength = 10;
    const { trainX, trainY } = prepareSequences(trainData, features, target, sequenceLength);
    const { testX, testY } = prepareSequences(testData, features, target, sequenceLength);
    
    // Build LSTM model
    const model = tf.sequential({
        layers: [
            tf.layers.lstm({
                units: 50,
                returnSequences: true,
                inputShape: [sequenceLength, features.length]
            }),
            tf.layers.dropout({ rate: 0.2 }),
            tf.layers.lstm({ units: 50, returnSequences: false }),
            tf.layers.dropout({ rate: 0.2 }),
            tf.layers.dense({ units: 1 })
        ]
    });
    
    model.compile({
        optimizer: tf.train.adam(0.001),
        loss: 'meanSquaredError',
        metrics: ['mae']
    });
    
    // Train model
    await model.fit(trainX, trainY, {
        epochs: 50,
        batchSize: 32,
        validationSplit: 0.2,
        callbacks: {
            onEpochEnd: (epoch, logs) => {
                console.log(`Epoch ${epoch + 1}: loss = ${logs.loss.toFixed(4)}, mae = ${logs.mae.toFixed(4)}`);
            }
        }
    });
    
    // Make predictions
    const predictions = model.predict(testX).dataSync();
    const actual = testY.dataSync();
    
    // Calculate metrics
    const metrics = calculateMetrics(Array.from(actual), Array.from(predictions));
    
    trainedModel = model;
    
    return {
        predictions: Array.from(predictions),
        actual: Array.from(actual),
        metrics,
        testData: testData.slice(sequenceLength)
    };
}

function normalizeData(trainData, testData, features) {
    const scaler = {};
    
    features.forEach(feature => {
        const values = trainData.map(d => d[feature]);
        const min = Math.min(...values);
        const max = Math.max(...values);
        scaler[feature] = { min, max };
    });
    
    const normalizedTrain = trainData.map(row => {
        const normalized = {};
        features.forEach(feature => {
            const { min, max } = scaler[feature];
            normalized[feature] = (row[feature] - min) / (max - min);
        });
        return normalized;
    });
    
    const normalizedTest = testData.map(row => {
        const normalized = {};
        features.forEach(feature => {
            const { min, max } = scaler[feature];
            normalized[feature] = (row[feature] - min) / (max - min);
        });
        return normalized;
    });
    
    return { normalizedTrain, normalizedTest, scaler };
}

function findNearestNeighbors(point, dataset, k) {
    const distances = dataset.map((data, idx) => {
        const dist = Object.keys(point).reduce((sum, key) => {
            return sum + Math.pow(point[key] - data[key], 2);
        }, 0);
        return { idx, dist: Math.sqrt(dist) };
    });
    
    distances.sort((a, b) => a.dist - b.dist);
    return distances.slice(0, k).map(d => d.idx);
}

function prepareSequences(data, features, target, sequenceLength) {
    const sequences = [];
    const labels = [];
    
    for (let i = 0; i < data.length - sequenceLength; i++) {
        const sequence = [];
        for (let j = 0; j < sequenceLength; j++) {
            const point = features.map(f => data[i + j][f]);
            sequence.push(point);
        }
        sequences.push(sequence);
        labels.push([data[i + sequenceLength][target]]);
    }
    
    return {
        trainX: tf.tensor3d(sequences),
        trainY: tf.tensor2d(labels)
    };
}

function calculateMetrics(actual, predicted) {
    const n = actual.length;
    
    // RMSE
    const mse = actual.reduce((sum, act, i) => sum + Math.pow(act - predicted[i], 2), 0) / n;
    const rmse = Math.sqrt(mse);
    
    // MAE
    const mae = actual.reduce((sum, act, i) => sum + Math.abs(act - predicted[i]), 0) / n;
    
    // R²
    const mean = actual.reduce((sum, val) => sum + val, 0) / n;
    const ssTot = actual.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0);
    const ssRes = actual.reduce((sum, act, i) => sum + Math.pow(act - predicted[i], 2), 0);
    const r2 = 1 - (ssRes / ssTot);
    
    // Accuracy (within 5% threshold)
    const threshold = 0.05;
    const accurate = actual.filter((act, i) => Math.abs(act - predicted[i]) / act < threshold).length;
    const accuracy = (accurate / n) * 100;
    
    return { rmse, mae, r2, accuracy };
}

function displayResults(results) {
    resultsSection.style.display = 'block';
    
    // Display metrics
    document.getElementById('rmseValue').textContent = results.metrics.rmse.toFixed(4);
    document.getElementById('maeValue').textContent = results.metrics.mae.toFixed(4);
    document.getElementById('r2Value').textContent = results.metrics.r2.toFixed(4);
    document.getElementById('accuracyValue').textContent = results.metrics.accuracy.toFixed(2) + '%';
    
    // Create chart
    createPredictionChart(results.actual, results.predictions);
    
    // Display predictions table
    displayPredictionsTable(results.actual, results.predictions, results.testData);
    
    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

function createPredictionChart(actual, predicted) {
    const ctx = document.getElementById('predictionChart').getContext('2d');
    
    if (chart) {
        chart.destroy();
    }
    
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: actual.map((_, i) => i + 1),
            datasets: [
                {
                    label: 'Actual Capacity',
                    data: actual,
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    borderWidth: 2,
                    pointRadius: 3
                },
                {
                    label: 'Predicted Capacity',
                    data: predicted,
                    borderColor: '#764ba2',
                    backgroundColor: 'rgba(118, 75, 162, 0.1)',
                    borderWidth: 2,
                    pointRadius: 3
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Actual vs Predicted Battery Capacity',
                    font: { size: 16 }
                },
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: 'Capacity (Ah)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Cycle Number'
                    }
                }
            }
        }
    });
}

function displayPredictionsTable(actual, predicted, testData) {
    const tbody = document.getElementById('predictionsBody');
    tbody.innerHTML = '';
    
    // Show first 10 predictions
    const displayCount = Math.min(10, actual.length);
    for (let i = 0; i < displayCount; i++) {
        const tr = document.createElement('tr');
        const error = Math.abs(actual[i] - predicted[i]);
        
        tr.innerHTML = `
            <td>${i + 1}</td>
            <td>${actual[i].toFixed(4)}</td>
            <td>${predicted[i].toFixed(4)}</td>
            <td>${error.toFixed(4)}</td>
        `;
        tbody.appendChild(tr);
    }
}

function downloadResults() {
    if (!batteryData) return;
    
    const results = {
        metrics: {
            rmse: document.getElementById('rmseValue').textContent,
            mae: document.getElementById('maeValue').textContent,
            r2: document.getElementById('r2Value').textContent,
            accuracy: document.getElementById('accuracyValue').textContent
        },
        model: modelSelect.value,
        timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `battery_health_results_${new Date().getTime()}.json`;
    a.click();
    URL.revokeObjectURL(url);
}
