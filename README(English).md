# EMT Physics – Physics Exploration Platform

## Project Overview

EMT Physics is an interactive learning platform designed for beginners in physics, committed to providing equitable access to physics education for learners worldwide. By leveraging AI-powered image recognition, the platform automatically analyzes keywords from physics problems and accurately matches them with corresponding PhET interactive simulations. A built-in AI learning assistant, **Sir Isaac Newton**, answers physics questions any time, transforming abstract physics concepts into intuitive, hands-on learning experiences.

## Project Structure

```
EMT-Physics/
├── index.html            # Page structure (entry point)
├── assets/
│   └── favicon.svg       # Site icon (atom style)
├── css/
│   └── style.css         # All styles (physics-inspired palette & animations)
├── js/
│   ├── config.js         # Global config (typewriter / sim library / keywords / AI)
│   ├── physics-tools.js  # Physics text analysis (relevance & matching, pure functions)
│   ├── typewriter.js     # Mission-statement typewriter animation
│   ├── particles.js      # Canvas quantum particle background
│   ├── audio.js          # Web Audio startup sound effect
│   ├── ocr.js            # Image preprocessing + OCR recognition + result analysis
│   ├── chat.js           # AI assistant "Sir Isaac Newton"
│   ├── ui.js             # Toast / nav scrolling / footer year
│   └── main.js           # App entry (module initialization)
├── README（中文）.md     # Chinese documentation
└── README(English).md    # English documentation
```

## Key Features

### ✨ Immersive Physics-Inspired Interface

* Frosted-glass navigation bar with smooth scrolling to sections
* Signature spectrum gradient color palette that visualizes the flow of energy
* Dynamic quantum particle background powered by Canvas, creating an immersive physics-inspired atmosphere
* Spring-damping page transitions that replicate the feel of real physical motion

### 🧠 AI Learning Assistant – "Sir Isaac Newton"

* Powered by the Doubao LLM (Volcengine Ark, OpenAI-compatible API), called directly from the browser
* Ask physics questions any time; responses delivered in Newton's scholarly yet approachable persona
* Quick-question chips for instant exploration; configure your API key once, and it stays in your local browser

### 🔍 AI-Powered Simulation Matching

* OCR-based image recognition using Tesseract.js with support for both Chinese and English physics problems
* **Enhanced image preprocessing:** auto-rescaling + grayscale + contrast boost for noticeably better recognition accuracy
* **Physics relevance check:** non-physics images receive a friendly "Please upload a physics-related problem" notice
* Built-in keyword matching engine supporting **12 PhET simulations**:
  * Mechanics: Pendulum Lab, Forces & Motion, Projectile Motion, Gravity Force Lab, Buoyancy, Under Pressure, Gravity & Orbits
  * Electricity: Circuit Construction Kit, Capacitor Lab
  * Energy: Energy Skate Park, Energy Forms & Changes
  * Waves: Wave on a String
* One-click access to official PhET Interactive Simulations with no software installation required

### ⌨️ Interactive User Experience

* Typewriter-style mission statement with a blinking signal-transmission cursor
* Personalized greeting for each explorer (name remembered locally)
* Experiment launch countdown with explosion animations, energy-pulse buttons, and Web Audio startup sound
* Random physics-themed motivational quotes after a successful match
* One-click copy / clear for OCR results

### 📱 Cross-Platform Compatibility

* Fully responsive layout optimized for both desktop and mobile browsers
* Chat panel becomes a full-screen bottom sheet on mobile

---

## Technology Stack

* **Pure Static Implementation:** Standard project structure with HTML, CSS, and JavaScript in separate files, no build tools required
* **OCR Engine:** Tesseract.js v5 (CDN, bilingual support, with image preprocessing pipeline)
* **AI Assistant:** Doubao LLM / Volcengine Ark API (OpenAI-compatible, direct browser calls)
* **Physics Simulations:** PhET Interactive Simulations, the open-source physics simulation platform
* **Audio Effects:** Native Web Audio API for synthesized startup sound effects
* **Background Animation:** Canvas 2D rendering for particle-based physics animations

---

## Getting Started

### System Requirements

* Modern web browser (Chrome 90+, Edge 90+, Safari 15+, or newer)
* Internet connection required for the OCR engine, AI assistant, and PhET simulation pages

### Usage

1. Open `index.html` directly in your browser, or deploy to GitHub Pages / any static host.
2. Enter your explorer name and click **Continue** for a personalized greeting.
3. Upload a local image containing a physics problem.
4. Wait for OCR to finish; recognized text appears in the results panel.
5. If a simulation matches, the experiment name and a motivational quote are displayed. Click **Launch Physics Experiment**.
6. After the 3-second launch animation, the PhET simulation opens in a new tab.
7. Stuck on a concept? Click **Sir Isaac Newton** (bottom-right) and ask anytime.

### Configure the AI Assistant (one-time setup)

1. Click **Sir Isaac Newton** → the ⚙ button in the chat header.
2. Go to the [Volcengine Ark Console](https://console.volcengine.com/ark) and enable the Doubao LLM.
3. Create an inference endpoint; paste your API Key and Model ID into the settings.
4. Click **Save & Test Connection**; you are ready once it reports success.
> Security note: your API key is stored only in your local browser. Use a restricted key and keep it safe.

---

## Extending the Platform

Add more physics topics by editing `EMT.PHYSICS_SIMS` in `js/config.js`:

```javascript
EMT.PHYSICS_SIMS = [
    {
        name: 'Simulation Name',
        keywords: ['keyword1', 'keyword2', 'keyword3'],
        url: 'PhET Simulation URL'
    },
    // Add more simulations here
];
```

To tune the physics relevance check, edit `EMT.PHYSICS_KEYWORDS` and `EMT.PHYSICS_STRONG_KEYWORDS`.

---

## Notes

* OCR accuracy depends on image quality and contrast; clear images with minimal background interference are recommended.
* Simulation pages are hosted on the official PhET platform, so an internet connection is required.
* On first OCR use, the browser downloads Chinese and English language models, which may take a few seconds.
* The AI assistant requires a valid Ark API key and network connection.

---

## Copyright & Contact

* **Project Vision:** Helping more physics beginners access equitable educational opportunities.
* **Contact:** [emmettqin@foxmail.com](mailto:emmettqin@foxmail.com)
* **Copyright © 2025 EMT Physics. All Rights Reserved.**
