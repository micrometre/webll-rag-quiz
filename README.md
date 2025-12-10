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

## 🤖 Supported LLM Models (WebLLM)

All LLM models are powered by [WebLLM](https://github.com/mlc-ai/web-llm), which runs large language models directly in the browser using WebGPU acceleration. Models are compiled to run efficiently on the GPU using [MLC LLM](https://llm.mlc.ai/).

| Model | Model ID | Size | Notes |
|-------|----------|------|-------|
| Qwen2.5 0.5B | `Qwen2.5-0.5B-Instruct-q4f32_1-MLC` | ~400MB | **Fastest** - Great for quick responses |
| Qwen2.5 1.5B | `Qwen2.5-1.5B-Instruct-q4f32_1-MLC` | ~1GB | Good balance of speed and quality |
| Llama 3.2 1B | `Llama-3.2-1B-Instruct-q4f32_1-MLC` | ~700MB | Meta's latest small model |
| SmolLM2 360M | `SmolLM2-360M-Instruct-q4f32_1-MLC` | ~250MB | Tiny model for basic tasks |
| TinyLlama 1.1B | `TinyLlama-1.1B-Chat-v1.0-q4f32_1-MLC` | ~700MB | Compact and efficient |

### Model Quantization

All models use `q4f32_1` quantization:
- **q4**: 4-bit weight quantization (reduces model size)
- **f32**: 32-bit floating-point activations
- **MLC**: Compiled with MLC LLM for WebGPU

### Adding More Models

You can add any model from the [WebLLM Model List](https://github.com/mlc-ai/web-llm/blob/main/src/config.ts). Simply add the model ID to the dropdown in `index.html`.

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

### Core AI Libraries

| Package | Purpose | Runtime |
|---------|---------|--------|
| [@mlc-ai/web-llm](https://github.com/mlc-ai/web-llm) | LLM inference (text generation, Q&A) | WebGPU |
| [@huggingface/transformers](https://github.com/huggingface/transformers.js) | Text embeddings for RAG | WASM/WebGPU |

### WebLLM Details

WebLLM enables running large language models natively in the browser:
- **WebGPU Backend**: Utilizes GPU for fast inference
- **Model Caching**: Models are cached in browser storage after first download
- **OpenAI-Compatible API**: Uses familiar chat completions API
- **No Server Required**: All computation happens client-side

```javascript
// Example WebLLM usage in this project
import * as webllm from '@mlc-ai/web-llm';

const engine = await webllm.CreateMLCEngine("Qwen2.5-0.5B-Instruct-q4f32_1-MLC");
const response = await engine.chat.completions.create({
  messages: [{ role: "user", content: "Hello!" }]
});
```

### Build Tools

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

- [MLC AI](https://mlc.ai/) for the amazing [WebLLM](https://github.com/mlc-ai/web-llm) library
- [Hugging Face](https://huggingface.co/) for [Transformers.js](https://github.com/huggingface/transformers.js)
- Model creators:
  - [Qwen](https://github.com/QwenLM/Qwen2.5) by Alibaba
  - [Llama](https://llama.meta.com/) by Meta
  - [SmolLM](https://huggingface.co/HuggingFaceTB/SmolLM2-360M-Instruct) by Hugging Face
  - [TinyLlama](https://github.com/jzhang38/TinyLlama) by Zhang et al.

## 🔗 Useful Links

- [WebLLM Documentation](https://github.com/mlc-ai/web-llm#readme)
- [WebLLM Model List](https://github.com/mlc-ai/web-llm/blob/main/src/config.ts)
- [MLC LLM](https://llm.mlc.ai/) - Compile your own models for WebLLM
- [WebGPU Specification](https://www.w3.org/TR/webgpu/)
- [Transformers.js Documentation](https://huggingface.co/docs/transformers.js)

---

Made with ❤️ using [WebLLM](https://github.com/mlc-ai/web-llm), [Transformers.js](https://github.com/huggingface/transformers.js), and WebGPU
