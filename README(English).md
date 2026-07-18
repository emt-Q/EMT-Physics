# EMT Physics – Physics Exploration Platform

## Project Overview

EMT Physics is an interactive learning platform designed for beginners in physics, committed to providing equitable access to physics education for learners worldwide. By leveraging AI-powered image recognition, the platform automatically analyzes keywords from physics problems and accurately matches them with corresponding PhET interactive simulations, transforming abstract physics concepts into intuitive, hands-on learning experiences that inspire curiosity and exploration.

## Key Features

### ✨ Immersive Physics-Inspired Interface

* Frosted-glass navigation bar with animations following realistic motion curves
* Signature spectrum gradient color palette that visualizes the flow of energy
* Dynamic quantum particle background powered by Canvas, creating an immersive physics-inspired atmosphere
* Spring-damping page transitions that replicate the feel of real physical motion

### ⌨️ Interactive User Experience

* Typewriter-style mission statement on the homepage with a blinking signal-transmission cursor
* Personalized greeting for each explorer with subtle interactive feedback
* Experiment launch countdown featuring explosion animations, energy-pulse buttons, and startup sound effects generated using the native Web Audio API
* Random physics-themed motivational quotes displayed after a successful experiment match

### 🔍 AI-Powered Simulation Matching

* OCR-based image recognition using Tesseract.js with support for both Chinese and English physics problems
* Built-in keyword matching engine currently supporting:

  * **Pendulum Lab** (keywords: *pendulum, length, period, simple harmonic motion*, 单摆, 摆长, 周期, 简谐, etc.)
  * **Circuit Construction Kit** (keywords: *circuit, resistance, current, voltage, Ohm's law*, 电阻, 电流, 电压, 欧姆, etc.)
* One-click access to official PhET Interactive Simulations with no software installation required

### 📱 Cross-Platform Compatibility

* Fully responsive layout optimized for both desktop and mobile browsers
* Mobile-friendly touch interactions and adaptive typography

---

## Technology Stack

* **Pure Static Implementation:** A single HTML file containing embedded CSS and native JavaScript, with no build tools or frameworks required
* **OCR Engine:** Tesseract.js v5 (loaded via CDN with bilingual Chinese-English recognition support)
* **Physics Simulations:** PhET Interactive Simulations, the open-source physics simulation platform
* **Audio Effects:** Native Web Audio API for synthesizing startup sound effects without external audio files
* **Background Animation:** Canvas 2D rendering for particle-based physics animations

---

## Getting Started

### System Requirements

* Modern web browser (Chrome 90+, Edge 90+, Safari 15+, or newer)
* Internet connection required for loading the OCR engine and opening PhET simulation pages

### Usage

1. Open the `index.html` file directly in your browser.
2. Enter your explorer name and click **Continue** to receive a personalized greeting.
3. Upload a local image containing a physics problem (currently supporting pendulum and circuit-related questions).
4. Wait for the OCR process to finish. The recognized text will appear in the results panel.
5. If a matching simulation is found, the corresponding experiment and a motivational quote will be displayed. Click **Launch Physics Experiment**.
6. After a 3-second launch animation, the corresponding PhET simulation will automatically open in a new browser tab.

---

## Extending the Platform

To support additional physics topics, simply modify the `PHYSICS_SIMS` array in the JavaScript section of `index.html`:

```javascript
const PHYSICS_SIMS = [
    {
        name: 'Simulation Name',
        keywords: ['keyword1', 'keyword2', 'keyword3'],
        url: 'PhET Simulation URL'
    },
    // Add more simulations here
];
```

---

## Notes

* OCR accuracy depends on image quality, text clarity, and contrast. Clear images with minimal background interference are recommended.
* Simulation pages are hosted on the official PhET platform, so an internet connection is required.
* During the first use of the OCR feature, your browser will automatically download the required Chinese and English language models, which may take a few seconds.

---

## Copyright & Contact

* **Project Vision:** Helping more physics beginners access equitable educational opportunities.
* **Contact:** [emmettqin@foxmail.com](mailto:emmettqin@foxmail.com)
* **Copyright © 2025 EMT Physics. All Rights Reserved.**
