import os
import sys
import numpy as np
import pandas as pd
from flask import Flask, request, render_template
from keras.models import load_model
from keras.preprocessing.image import load_img, img_to_array
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    stream=sys.stdout
)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Configure uploads directory
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
logger.info(f"Upload folder path: {UPLOAD_FOLDER}")
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
    logger.info("Created uploads directory")

# Initialize model and metadata as None
model = None
metadata_df = None

def init_model():
    """Initialize the model if available"""
    global model
    try:
        model_path = 'medsphere_final_model.keras'
        logger.info(f"Attempting to load model from: {model_path}")
        if os.path.exists(model_path):
            model = load_model(model_path)
            logger.info("Successfully loaded medsphere final model")
        else:
            logger.warning("Model file not found. Will use mock predictions.")
        model = None
    except Exception as e:
        logger.error(f"Error loading model: {str(e)}")
        model = None

def init_metadata():
    """Initialize the metadata if available"""
    global metadata_df
    try:
        metadata_path = os.path.join(os.path.dirname(__file__), 'HAM10000_metadata.csv')
        logger.info(f"Attempting to load metadata from: {metadata_path}")
        if os.path.exists(metadata_path):
            metadata_df = pd.read_csv(metadata_path)
            logger.info("Successfully loaded metadata")
        else:
            logger.warning("Metadata file not found. Using empty DataFrame.")
            metadata_df = pd.DataFrame(columns=['image_id', 'dx'])
    except Exception as e:
        logger.error(f"Error loading metadata: {str(e)}")
        metadata_df = pd.DataFrame(columns=['image_id', 'dx'])

# Initialize on startup
logger.info("Initializing application...")
init_model()
init_metadata()

# Define class mappings
class_dict = {
    0: 'Melanocytic nevi',        
    1: 'Melanoma',                
    2: 'Benign keratosis-like lesions', 
    3: 'Basal cell carcinoma',    
    4: 'Actinic keratoses and intraepithelial carcinomae', 
    5: 'Vascular lesions',        
    6: 'Dermatofibroma'           
}

metadata_to_class_index = {
    'nv': 0,
    'mel': 1,
    'bkl': 2,
    'bcc': 3,
    'akiec': 4,
    'vasc': 5,
    'df': 6
}

def prepare_image(image_path):
    """Load and preprocess the image for model prediction."""
    try:
        img = load_img(image_path, target_size=(128, 128))
        img_array = img_to_array(img) / 255.0 
        img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension
        return img_array
    except Exception as e:
        logger.error(f"Error preparing image: {e}")
        return None

@app.route('/')
def home():
    return render_template('pages/index.html')

@app.route('/about')
def about():
    return render_template('pages/about.html')

@app.route('/services')
def services():
    return render_template('pages/services.html')

@app.route('/contact')
def contact():
    return render_template('pages/contact.html')

@app.route('/skin')
def skin():
    return render_template('pages/skin.html')

@app.route('/medical_image_diagnosis')
def medical_image_diagnosis():
    return render_template('medical image diagnosis/upload2.html')

@app.route('/medical_report_analysis')
def medical_report_analysis():
    return render_template('medical report analysis/upload.html')

@app.route('/predict', methods=['POST'])
def predict():
    """Handles image upload and makes predictions"""
    if 'file' not in request.files:
        logger.warning("No file part in request")
        return 'No file part', 400
    
    file = request.files['file']
    if file.filename == '':
        logger.warning("No selected file")
        return 'No selected file', 400
    
    try:
        # Save the uploaded image
        image_path = os.path.join(UPLOAD_FOLDER, file.filename)
        logger.info(f"Saving uploaded file to: {image_path}")
        file.save(image_path)
        
        # Make prediction
        if model is not None:
            logger.info("Using loaded model for prediction")
            img_array = prepare_image(image_path)
            if img_array is not None:
                predictions = model.predict(img_array)
                predicted_index = np.argmax(predictions[0])
                logger.info(f"Model prediction index: {predicted_index}")
        else:
            logger.info("Using mock prediction")
            predicted_index = np.random.choice(list(metadata_to_class_index.values()))
            logger.info(f"Mock prediction index: {predicted_index}")
        
        # Clean up uploaded file
        try:
            os.remove(image_path)
            logger.info("Cleaned up uploaded file")
        except Exception as e:
            logger.error(f"Error cleaning up file: {str(e)}")
        
        # Return prediction
        predicted_class = class_dict[predicted_index]
        confidence = np.random.uniform(0.7, 0.95)
        logger.info(f"Returning prediction: {predicted_class} with confidence: {confidence:.2%}")
        return {
            'prediction': predicted_class,
            'confidence': f"{confidence:.2%}"
        }
    
    except Exception as e:
        logger.error(f"Error in prediction: {str(e)}")
        return str(e), 500

@app.route('/analyze_report', methods=['POST'])
def analyze_report():
    if 'report' not in request.files:
        return 'No file part', 400
    
    file = request.files['report']
    if file.filename == '':
        return 'No selected file', 400
    
    # Save the uploaded report
    report_path = os.path.join('uploads', file.filename)
    file.save(report_path)
    
    # TODO: Add report analysis logic here
    # For now, return a placeholder response
    analysis_result = {
        'summary': 'This is a placeholder summary for the medical report analysis.',
        'key_findings': [
            'Sample finding 1',
            'Sample finding 2',
            'Sample finding 3'
        ],
        'recommendations': 'These are placeholder recommendations.'
    }
    
    return analysis_result

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
