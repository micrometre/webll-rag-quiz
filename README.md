# 🧠 Browser RAG Quiz

A 100% browser-based RAG (Retrieval-Augmented Generation) quiz application. Run AI models directly in your browser — no server required!

[![WebGPU Powered](https://img.shields.io/badge/WebGPU-Powered-blue?style=for-the-badge)](https://www.w3.org/TR/webgpu/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
[![100% Client-Side](https://img.shields.io/badge/100%25-Client--Side-orange?style=for-the-badge)]()

## ✨ Features

- 🔒 **100% Client-Side** — All processing happens in your browser. No data leaves your device.
- ⚡ **WebGPU Acceleration** — Uses GPU for fast LLM inference
- 🔍 **Real RAG Pipeline** — Embeds documents, retrieves context, and augments LLM responses
- 🧠 **Smart Evaluation** — LLM validates answers using retrieved context
- 💾 **Model Caching** — Models are cached locally after first download
- 📱 **Responsive Design** — Works on desktop and mobile
- 🎨 **Dark Theme** — Easy on the eyes

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      Browser                             │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐ │
│  │  WebLLM     │    │Transformers │    │  In-Memory  │ │
│  │  (Qwen/     │    │    .js      │    │  Vector     │ │
│  │   Llama)    │    │ (Embeddings)│    │   Store     │ │
│  └─────────────┘    └─────────────┘    └─────────────┘ │
│         │                  │                  │         │
│         └──────────────────┼──────────────────┘         │
│                            │                            │
│                   ┌────────▼────────┐                   │
│                   │   Quiz Engine   │                   │
│                   │  - RAG Retrieval│                   │
│                   │  - LLM Grading  │                   │
│                   │  - Scoring      │                   │
│                   └─────────────────┘                   │
└─────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Chrome 113+ or Edge 113+ (WebGPU support required)
- A GPU (integrated graphics work, dedicated GPU recommended)

### Installation

```bash
# Clone the repository
git clone https://github.com/micrometre/web-rag
cd web-rag

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in Chrome or Edge.

### Production Build

```bash
npm run build
npm run preview
```

## 🤖 Supported LLM Models

| Model | Size | Notes |
|-------|------|-------|
| Qwen2.5 0.5B | ~400MB | **Fastest** - Great for quick responses |
| Qwen2.5 1.5B | ~1GB | Good balance of speed and quality |
| Llama 3.2 1B | ~700MB | Meta's latest small model |
| SmolLM2 360M | ~250MB | Tiny model for basic tasks |
| TinyLlama 1.1B | ~700MB | Compact and efficient |

## 🔧 How It Works

1. **Embedding Model Loads** — Transformers.js loads `all-MiniLM-L6-v2` for text embeddings
2. **Knowledge Base Indexed** — Educational documents are embedded and stored in a vector store
3. **LLM Loads** — WebLLM loads your chosen model with WebGPU acceleration
4. **Quiz Begins** — For each question:
   - Relevant context is retrieved from the knowledge base (RAG)
   - You answer the question
   - The LLM evaluates your answer using the retrieved context
   - You receive personalized feedback
5. **Results** — The LLM generates a personalized summary of your performance

## 📚 Knowledge Base Topics

The built-in knowledge base covers:
- Python Programming
- Machine Learning & Deep Learning
- Large Language Models (LLMs)
- RAG & Prompt Engineering
- Web Development (HTML, CSS, JavaScript)
- Data Science (Pandas, NumPy)
- WebGPU & Browser AI

You can easily extend the knowledge base by editing `src/knowledgeBase.js`.

## ⚠️ WebGPU Troubleshooting

If you see "No WebGPU adapter found", enable WebGPU in Chrome:

### Option 1: Enable via Chrome Flags

1. Open `chrome://flags` in Chrome
2. Search for `#enable-unsafe-webgpu`
3. Set it to **Enabled**
4. Click **Relaunch**

### Option 2: Launch Chrome with Flags (Linux)

```bash
google-chrome --enable-unsafe-webgpu --enable-features=Vulkan --use-vulkan http://localhost:5173
```

### Option 3: If You Get Shader Errors

```bash
google-chrome --enable-unsafe-webgpu --use-angle=gl http://localhost:5173
```

### Verify WebGPU Status

1. Open `chrome://gpu` in Chrome
2. Scroll to find "WebGPU"
3. Should show "Hardware accelerated" ✅

## 📦 Dependencies

- [@mlc-ai/web-llm](https://github.com/mlc-ai/web-llm) — WebGPU-accelerated LLM inference
- [@xenova/transformers](https://github.com/xenova/transformers.js) — ONNX-based embeddings in the browser
- [Vite](https://vitejs.dev/) — Fast build tool and dev server

## 🗂️ Project Structure

```
browser-rag-quiz/
├── index.html              # Main HTML with quiz UI
├── src/
│   ├── main.js             # Quiz application logic
│   ├── embeddingService.js # Transformers.js embeddings
│   ├── vectorStore.js      # In-memory vector database
│   ├── llmService.js       # WebLLM wrapper
│   ├── knowledgeBase.js    # Quiz content & questions
│   └── styles.css          # Dark theme styling
├── package.json            # Dependencies
└── vite.config.js          # Vite config with CORS headers
```

## 🧪 Tested Environment

- **OS:** Ubuntu 24.04 LTS
- **GPU:** Intel Iris Xe Graphics
- **Browser:** Chrome 113+
- **Model:** Qwen2.5 0.5B (q4f16)

## 🌐 Browser Compatibility

| Browser | Status |
|---------|--------|
| Chrome 113+ | ✅ Supported |
| Edge 113+ | ✅ Supported |
| Firefox | ⚠️ WebGPU behind flag |
| Safari | ⚠️ Limited WebGPU support |

## 📄 License

MIT License — feel free to use this project for any purpose.

## 🙏 Acknowledgments

- [MLC AI](https://mlc.ai/) for the amazing WebLLM library
- [Xenova](https://github.com/xenova) for Transformers.js
- Model creators: Qwen, Meta, Hugging Face

---

Made with ❤️ using WebLLM, Transformers.js, and WebGPU
