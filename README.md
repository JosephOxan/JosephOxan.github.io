# Battery Health Estimation - Frontend Application

This is a browser-based frontend application for battery health estimation using machine learning. It runs entirely in the browser without requiring a backend server.

## Features

- **File Upload**: Upload battery cycling data in CSV or JSON format
- **Data Visualization**: Preview uploaded data in an interactive table
- **Multiple ML Models**: Choose from different machine learning algorithms:
  - Random Forest (simulated)
  - AdaBoost (simulated)
  - Gradient Boosting (simulated)
  - LSTM Neural Network (using TensorFlow.js)
- **Real-time Training**: Train models directly in the browser
- **Results Visualization**: 
  - Interactive charts comparing actual vs predicted values
  - Performance metrics (RMSE, MAE, R², Accuracy)
  - Predictions table
- **Export Results**: Download results as JSON

## Getting Started

### Prerequisites

- Modern web browser (Chrome, Firefox, Edge, Safari)
- No installation required!

### Running the Application

1. **Simple Method**: Just open `index.html` in your web browser
   - Double-click the file, or
   - Right-click and select "Open with" → your browser

2. **Using a Local Server** (recommended for better performance):
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Python 2
   python -m SimpleHTTPServer 8000
   
   # Using Node.js (if http-server is installed)
   npx http-server -p 8000
   ```
   Then navigate to `http://localhost:8000` in your browser

### Usage Instructions

1. **Upload Data**:
   - Click the upload area or drag and drop a CSV/JSON file
   - Sample data file is included: `sample_data.csv`
   - Your data should include these columns:
     - `cycle`: Cycle number
     - `voltage_measured`: Voltage measurements
     - `current_measured`: Current measurements
     - `temperature_measured`: Temperature measurements
     - `time`: Time stamps
     - `capacity`: Battery capacity (target variable)

2. **Configure Model**:
   - Select your preferred model from the dropdown
   - Adjust the training/test split ratio (default: 80/20)

3. **Train Model**:
   - Click "Train Model" button
   - Wait for training to complete (progress shown via spinner)
   - Results will appear automatically

4. **View Results**:
   - Performance metrics displayed in cards
   - Interactive chart showing actual vs predicted values
   - Sample predictions table
   - Download results as JSON

## Data Format

### CSV Format
```csv
cycle,voltage_measured,current_measured,temperature_measured,time,capacity
1,4.1993,−0.0019,23.9370,0.0000,1.8911
2,4.1989,−0.0018,23.9526,0.0000,1.8865
```

### JSON Format
```json
[
  {
    "cycle": 1,
    "voltage_measured": 4.1993,
    "current_measured": -0.0019,
    "temperature_measured": 23.9370,
    "time": 0.0000,
    "capacity": 1.8911
  },
  {
    "cycle": 2,
    "voltage_measured": 4.1989,
    "current_measured": -0.0018,
    "temperature_measured": 23.9526,
    "time": 0.0000,
    "capacity": 1.8865
  }
]
```

## Technical Details

### Technologies Used

- **HTML5**: Structure and layout
- **CSS3**: Styling and responsive design
- **JavaScript (ES6+)**: Application logic
- **TensorFlow.js**: LSTM neural network implementation
- **Chart.js**: Data visualization

### Model Implementations

1. **Classic ML Models** (Random Forest, AdaBoost, Gradient Boosting):
   - Implemented using K-Nearest Neighbors approximation
   - Feature normalization
   - Ensemble prediction

2. **LSTM Neural Network**:
   - Built with TensorFlow.js
   - 2 LSTM layers (50 units each)
   - Dropout layers for regularization
   - 50 epochs training with validation split

### Performance Metrics

- **RMSE** (Root Mean Squared Error): Overall prediction error
- **MAE** (Mean Absolute Error): Average absolute error
- **R²** (R-squared): Goodness of fit (0-1, higher is better)
- **Accuracy**: Percentage of predictions within 5% of actual values

## Browser Compatibility

- Chrome/Edge: ✅ Fully supported
- Firefox: ✅ Fully supported
- Safari: ✅ Fully supported
- IE11: ❌ Not supported

## File Size Limits

- Maximum file size: 10 MB
- For larger datasets, consider:
  - Sampling your data
  - Using data aggregation
  - Splitting into multiple files

## Troubleshooting

### Model Training is Slow
- Reduce the dataset size
- Use a simpler model (Random Forest instead of LSTM)
- Try a different browser (Chrome recommended for TensorFlow.js)

### File Upload Fails
- Check file format (CSV or JSON only)
- Verify file size (< 10MB)
- Ensure all required columns are present

### Results Look Incorrect
- Verify data quality and format
- Try different train/test splits
- Experiment with different models

## Privacy & Security

- All data processing happens locally in your browser
- No data is sent to any server
- No internet connection required after loading the page
- Your data never leaves your computer

## Future Enhancements

Potential improvements:
- [ ] More sophisticated feature engineering
- [ ] Hyperparameter tuning interface
- [ ] Cross-validation support
- [ ] More visualization options
- [ ] Export trained models
- [ ] Batch prediction mode

## License

This project is provided as-is for educational and research purposes.

## Credits

Based on battery health estimation research using machine learning techniques for lithium-ion battery capacity prediction.

## Contact

For issues, questions, or contributions, please refer to the original project repository.

---

**Note**: This is a simplified implementation for browser-based execution. For production use with large datasets, consider using a backend server with more computational resources.
