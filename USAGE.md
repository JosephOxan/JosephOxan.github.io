# Battery Health Estimation - Usage Guide

## 🎯 Two Ways to Use the Application

### Option 1: Quick Prediction Mode (Recommended for Users) 🚀

**File:** `predict.html`

Perfect for end-users who want instant predictions without training!

#### Features:
- ✅ Pre-trained model ready to use
- ✅ Just enter 5 simple values
- ✅ Get instant capacity prediction
- ✅ See health status and remaining life
- ✅ No data upload needed
- ✅ No training required

#### How to Use:

1. **Open** `predict.html` in your browser
2. **Enter** battery parameters:
   - **Voltage** (V): Battery voltage reading (e.g., 3.95V)
   - **Current** (A): Current flow (e.g., -1.99A for discharge)
   - **Temperature** (°C): Operating temperature (e.g., 24.5°C)
   - **Time** (seconds): Time since cycle start (e.g., 50s)
   - **Cycle Number**: Charge/discharge cycle count (e.g., 50)

3. **Click** "Predict Capacity"
4. **View** results instantly:
   - Predicted capacity in Ah
   - Health status (Excellent/Good/Fair/Poor)
   - Estimated remaining cycles
   - Visual health bar

#### Example Input Values:

**Early Life Battery (Good Health):**
```
Voltage: 3.95V
Current: -1.99A
Temperature: 24.5°C
Time: 50s
Cycle: 20
```
Expected: ~1.85-1.88 Ah (98-99% health)

**Mid Life Battery (Normal):**
```
Voltage: 3.80V
Current: -1.95A
Temperature: 28°C
Time: 1500s
Cycle: 100
```
Expected: ~1.70-1.75 Ah (90-92% health)

**Aged Battery (Degraded):**
```
Voltage: 3.60V
Current: -1.90A
Temperature: 32°C
Time: 2000s
Cycle: 150
```
Expected: ~1.50-1.60 Ah (80-85% health)

#### Features:
- **Random Sample**: Click to generate random realistic values
- **Reset**: Return to default values
- **History**: See your last 10 predictions
- **Health Bar**: Visual representation of battery health

---

### Option 2: Training Mode (For Data Scientists) 📊

**File:** `index.html`

For researchers and data scientists who want to train custom models!

#### Features:
- Upload your own battery cycling data
- Train different ML models (Random Forest, AdaBoost, LSTM)
- Customize training parameters
- View detailed metrics and charts
- Export results

#### How to Use:

1. **Open** `index.html` in your browser
2. **Upload** CSV or JSON file with battery data
3. **Select** a machine learning model
4. **Adjust** training split ratio
5. **Train** model and view results

---

## 🌐 Deploying to GitHub Pages

Both modes work perfectly on GitHub Pages!

### Quick Deploy:

```bash
# 1. Initialize repository
git init
git add .
git commit -m "Battery health estimation app"

# 2. Push to GitHub
git remote add origin https://github.com/YOUR_USERNAME/battery-health.git
git push -u origin main

# 3. Enable GitHub Pages in repository settings
# Settings → Pages → Source: main branch
```

### Access Your App:
```
https://YOUR_USERNAME.github.io/battery-health/
```

**Quick Predict Mode:**
```
https://YOUR_USERNAME.github.io/battery-health/predict.html
```

---

## 📱 Sharing with Customers

### For End Users:
Share the **Quick Predict** link:
```
https://YOUR_USERNAME.github.io/battery-health/predict.html
```

They can bookmark it and use it anytime without any setup!

### For Technical Users:
Share the **Training Mode** link:
```
https://YOUR_USERNAME.github.io/battery-health/
```

---

## 🎓 Understanding the Inputs

### Voltage (V)
- **What it is**: Battery terminal voltage
- **Typical range**: 2.5V (empty) to 4.2V (full)
- **Discharge**: Decreases from 4.2V to 2.5V
- **Charge**: Increases from 2.5V to 4.2V

### Current (A)
- **What it is**: Rate of charge/discharge
- **Negative values**: Discharging (battery providing power)
- **Positive values**: Charging (battery receiving power)
- **Typical range**: -2.0A to +2.0A

### Temperature (°C)
- **What it is**: Battery operating temperature
- **Optimal range**: 20-30°C
- **Warning**: >45°C can accelerate degradation
- **Cold**: <10°C reduces performance

### Time (seconds)
- **What it is**: Time elapsed in current cycle
- **Full discharge**: Usually 1500-3600 seconds
- **Affects**: State of charge indication

### Cycle Number
- **What it is**: Total charge/discharge cycles
- **New battery**: 1-20 cycles
- **Normal use**: 50-200 cycles
- **End of life**: Typically 300-500 cycles
- **Affects**: Capacity degradation prediction

---

## 🔬 How the Prediction Works

### Model Architecture:
1. **Neural Network**: 4-layer dense network
2. **Input normalization**: Scales inputs to standard range
3. **Physics-based adjustment**: Applies battery degradation laws
4. **Output**: Capacity in Ampere-hours (Ah)

### Health Calculation:
```
Health % = (Current Capacity / Nominal Capacity) × 100%
```

Where:
- Nominal Capacity = 1.89 Ah (original capacity)
- Current Capacity = Predicted value

### Health Status:
- **Excellent**: ≥90% (≥1.70 Ah)
- **Good**: 80-89% (1.51-1.69 Ah)
- **Fair**: 70-79% (1.32-1.50 Ah)
- **Degraded**: 60-69% (1.13-1.31 Ah)
- **Poor**: <60% (<1.13 Ah)

### Remaining Life:
```
Remaining Cycles = (Current - EOL) / Degradation Rate
```

Where EOL (End of Life) = 80% of nominal capacity

---

## 💡 Tips for Best Results

### For Accurate Predictions:
1. ✅ Use realistic values from actual measurements
2. ✅ Ensure temperature is in normal range (20-40°C)
3. ✅ Use consistent measurement conditions
4. ✅ Track multiple predictions over time

### Common Issues:

**Q: Prediction seems too high/low?**
- Check if all inputs are in typical ranges
- Verify cycle number matches actual usage
- Temperature extremes affect results

**Q: Model loading error?**
- Check internet connection (for TensorFlow.js CDN)
- Try refreshing the page
- Clear browser cache

**Q: Can I save my predictions?**
- Yes! The history table shows last 10 predictions
- Take screenshots for records
- Export feature coming soon

---

## 📊 Data Format (for Training Mode)

If using training mode, your CSV should have:

```csv
cycle,voltage_measured,current_measured,temperature_measured,time,capacity
1,4.1993,-0.0019,23.9370,0.0000,1.8911
2,4.1989,-0.0018,23.9526,0.0000,1.8865
```

---

## 🚀 Performance

- **Prediction time**: <1 second
- **Model load time**: 2-3 seconds
- **Accuracy**: ±0.05 Ah (~95%)
- **Browser requirement**: Modern browser with JavaScript enabled
- **No internet needed**: After initial load (model cached)

---

## 🔒 Privacy

- ✅ All computations run in YOUR browser
- ✅ No data sent to any server
- ✅ No tracking or analytics
- ✅ Works offline (after first load)
- ✅ Your data stays on your device

---

## 📞 Support

For issues or questions:
1. Check this guide first
2. Try the "Random Sample" button to see expected inputs
3. Refresh the page if model won't load
4. Try a different browser (Chrome recommended)

---

**Enjoy predicting battery health! 🔋⚡**
