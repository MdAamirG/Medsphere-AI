# MedSphere AI - Medical Image Analysis and Report Summarization

MedSphere AI is a web application that provides two main services:
1. Medical Image Diagnosis (focusing on skin cancer detection)
2. Medical Report Analysis and Summarization

## Features

- Skin Cancer Detection using deep learning model (HAM10000 dataset)
- Medical Report Analysis and Summarization
- Interactive Web Interface
- Real-time Analysis Results

## Tech Stack

- Python 3.10
- Flask
- TensorFlow/Keras
- HTML/CSS/JavaScript
- NumPy
- Pandas

## Project Structure

```
medsphere-ai/
│
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── README.md             # Project documentation
│
├── static/               # Static files
│   ├── css/             # Stylesheets
│   ├── js/              # JavaScript files
│   └── images/          # Image assets
│
├── templates/            # HTML templates
│   ├── medical image diagnosis/
│   ├── medical report analysis/
│   └── pages/           # Main page templates
│
├── models/              # Pre-trained models (not in repo)
│   └── .gitkeep
│
└── uploads/            # Temporary upload directory
    └── .gitkeep
```

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/medsphere-ai.git
   cd medsphere-ai
   ```

2. Create a virtual environment:
   ```bash
   python -m venv tensorflow_env
   ```

3. Activate the virtual environment:
   - Windows:
     ```bash
     .\tensorflow_env\Scripts\activate
     ```
   - Unix/MacOS:
     ```bash
     source tensorflow_env/bin/activate
     ```

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Download the model files:
   - Place `ham10000_skin_cancer_model.keras` in the root directory
   - Place `medsphere_final_model.keras` in the root directory

## Usage

1. Start the Flask application:
   ```bash
   python app.py
   ```

2. Open a web browser and navigate to:
   ```
   http://localhost:5000
   ```

## Model Information

The skin cancer detection model is trained on the HAM10000 dataset and can detect:
- Melanocytic nevi
- Melanoma
- Benign keratosis-like lesions
- Basal cell carcinoma
- Actinic keratoses
- Vascular lesions
- Dermatofibroma

## Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For any queries, please open an issue in the GitHub repository.
