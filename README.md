AI-Assisted Pixel Drawing

A lightweight browser-based AI system for personalized pixel drawing.
The system learns from your drawing habits in real-time and assists you by predicting your next strokes using frequency maps combined with a small CNN.


---

Features

User-adaptive AI: Trains directly from your inputs for personalized drawing predictions.

Frequency Maps: Tracks color, position, and neighboring pixels to enhance prediction quality.

Two AI Modes:

Fast: Lightweight, uses frequency maps with minimal CNN computation.

Accurate: Full prediction using all frequency data + CNN for higher quality, but slower.


Canvas Customization: Adjustable canvas size and brush pixel size.

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
