# Identification of Weeds from Crops Using YOLOv9 (Precision Agriculture)

## Overview
A cutting-edge, real-time deep learning system for detecting and classifying weeds in maize crops. This project leverages the YOLOv9 object detection model (PyTorch, Ultralytics) to advance precision agriculture and sustainable farming by enabling targeted herbicide use.

## Features
- **Real-time object detection** using YOLOv9, Ultralytics, and PyTorch
- **Robust data pipeline:** Advanced data augmentation (cropping, rotation, flipping, brightness adjustment) on Roboflow-sourced maize–weed dataset
- **ReactJS web interface:** Farmers can upload crop images and instantly visualize weed detection results with bounding boxes and class labels
- **High-performance metrics:** mAP 95.9%, Precision 97.8%, Recall 90.8%, F1-score 97.1%

## Technologies Used
- Python, PyTorch, Ultralytics YOLOv9
- ReactJS
- Roboflow (Dataset Management)

## Usage Instructions
1. **Prepare the dataset:** Download maize–weed images from Roboflow and apply preprocessing.
2. **Train the model:** Use provided scripts for training YOLOv9 on the annotated dataset.
3. **Test and Inference:** Access the ReactJS web app to upload images and view detection/classification output.
4. **Deploy:** Integrate the app for use in field or farm environments.

## Results
| Metric       | Value   |
|--------------|---------|
| mAP          | 95.9%   |
| Precision    | 97.8%   |
| Recall       | 90.8%   |
| F1-score     | 97.1%   |

## Impact
Significantly reduces chemical usage and environmental impact, improves crop yields, and empowers farmers with instant, accurate weed identification.

## Contact
For questions or collaboration, reach out via [LinkedIn](https://linkedin.com/in/sudheerprasannakumarvasetty) or open an issue.
