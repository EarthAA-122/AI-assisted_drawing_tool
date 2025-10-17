# AI-Assisted Pixel Drawing

A lightweight browser-based AI system for **personalized pixel drawing**.  
The system learns from your drawing habits in real-time and assists you by predicting your next strokes using frequency maps combined with a small Convolutional Neural Network (CNN).

---

## Features

- **User-Adaptive AI:** Trains directly from your inputs for personalized drawing predictions.
- **Frequency Maps:** Tracks color, position, and neighboring pixels to enhance prediction quality.
- **High-Precision Learning:** Values stored numerically (0–10,000) for more accurate percentages during calculations.
- **Two AI Modes:**
  - **Fast:** Uses only frequency maps and minimal CNN for real-time assistance.
  - **Accurate:** Uses all frequency maps and full CNN for higher quality, slower predictions.
- **Canvas Customization:** Adjustable canvas size and brush pixel size.
- **Coordinate Drawing:** Draw pixels precisely via input coordinates.
- **Upload Images:** Train AI using your drawings or existing images.
- **Save & Load Models:** Store AI models and frequency maps locally.
- **Cache & Preferences:** Stores user settings locally; includes a clear-cache option.
- **Mobile Friendly:** Works on touch devices, though **desktop use is recommended for convenient experimentation**.

---

## Installation

1. Clone or download the repository.  
   ```bash
   git clone https://github.com/YourUsername/AI-Assisted_Pixel_Drawing.git

2. Open index.html in your browser.
No server required — everything runs locally.




---

Usage Tips

Recommended for Desktop: Easier for precise input and full-feature experimentation.

AI Modes:

Fast Mode: Quick predictions for real-time assistance.

Accurate Mode: Higher-quality AI-assisted drawings at the cost of speed.


Brush Size: Adjust for finer or broader strokes.

Coordinate Input: Draw exact pixels; the system prevents out-of-canvas errors.

Saving Work: Save your frequency maps and models for future training.



---

Technical Notes

Runs entirely in-browser using TensorFlow.js.

Frequency maps store color, position, and neighbor frequency numerically for high precision.

Training and prediction are fully local; no data leaves your browser.

Supports multiple image uploads for batch training.



---

Contributing

Contributions and feature suggestions are welcome! Please open an issue or submit a pull request.


---

License

MIT License


---

Originality Note

This system is an original design by the author.
It combines frequency-based pixel learning, precision scaling, and CNN-assisted prediction for a personalized, local AI-assisted drawing experience.
Coordinate Drawing: Input specific coordinates to place pixels precisely.

Upload Images: Train AI using existing drawings or images.

Save & Load: Save AI model and frequency maps locally.

Cache & Preferences: Stores user settings locally; includes a clear-cache option.

Mobile Friendly: Works on touch devices (though desktop use is recommended for convenient experimentation).



---

Installation

Open index.html in your browser. No server required — everything runs locally.


---

Usage Tips

Recommended for Desktop: While the app works on mobile, experimenting and training is more convenient on a desktop due to larger screen and precise input.

AI Modes:

Use Fast mode for real-time assistance.

Use Accurate mode when you want higher-quality AI-assisted drawings, even if slower.


Pixel Size: Adjust the brush size for finer or broader strokes.

Coordinate Input: Use the coordinate inputs to draw exact pixels. The system prevents out-of-canvas errors.

Saving Work: Always save your frequency maps or model if you want to continue training later.



---

Technical Notes

Runs entirely in-browser using TensorFlow.js.

Frequency maps store color, position, and neighbor frequency numerically for high precision.

Training and prediction are local; no data is sent to a server.

Supports multiple image uploads for batch training.



---

Contributing

Contributions and feature suggestions are welcome!
Please open an issue or submit a pull request.


---

License

MIT License
