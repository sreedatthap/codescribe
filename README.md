<h1 align="center">CodeScribe 📝✨</h1>

<p align="center">
  <b>AI-Powered Code Documentation Generator for Modern Developers</b><br/>
  Instantly generate clear, professional, and enterprise-grade documentation from your source code — just like a senior engineer at Google, Amazon, or Microsoft would write.<br/>
  Perfect for interviews, code reviews, technical portfolios, and scaling engineering productivity.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Build-Powered%20by%20OpenRouter-blue?style=flat-square" />
  <img src="https://img.shields.io/badge/Stack-FastAPI%20%7C%20React%20%7C%20Tailwind-brightgreen?style=flat-square" />
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=flat-square" />
</p>

---

## ✨ What is CodeScribe?

**CodeScribe** is an open-source AI tool that helps developers automatically generate professional, FAANG+ level documentation for their codebases. Just paste your code or upload a file, and let the AI do the rest.

---

## 🚀 Features

- ✅ **Multi-language Support** – Supports Python, Java, JavaScript, and C++
- 🤖 **AI-Powered Analysis** – Deep code understanding using OpenRouter API
- 📁 **File Upload** – Drag & drop or browse to upload source code files
- 📄 **Export Options** – Copy to clipboard or download as a `.txt` file
- 🎨 **Modern UI** – Clean, responsive interface with animated backgrounds
- 📘 **Enterprise-Grade Docs** – Aligned with top-tier engineering standards

---

## 🧠 Tech Stack

### Frontend
- ⚛️ React 18 + Vite
- 🎨 Tailwind CSS
- ✍️ Monaco Editor (VS Code’s Editor)
- 🎥 Framer Motion (UI animations)
- 🌌 Three.js + Vanta.js (3D/animated background)

### Backend
- 🐍 FastAPI (Python)
- 🔌 OpenRouter API (LLM-powered doc generation)
- ⚡ HTTPX (Async HTTP client)

---

## 🛠️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+)
- [Python](https://www.python.org/) (3.8+)
- npm or yarn

### 📦 Installation

```bash
# Clone the repository
git clone https://github.com/sreedatthap/codescribe.git
cd codescribe
```

#### 🔧 Backend Setup

```bash
cd codescribe-backend
python -m venv venv
source venv/bin/activate  # Windows: .\venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file inside `codescribe-backend`:

```env
OPENAI_API_KEY=your_openrouter_api_key_here
```

#### 🎨 Frontend Setup

```bash
cd ../codescribe-frontend
npm install
```

---

## ▶️ Running the Application

```bash
# Start the backend server
cd codescribe-backend
uvicorn main:app --reload
```

```bash
# Start the frontend development server
cd ../codescribe-frontend
npm run dev
```

Now open your browser and visit: [http://localhost:5173](http://localhost:5173)

---

## 📖 How to Use

1. **Enter Code**: Paste code into the Monaco editor or upload a file
2. **Select Language**: Choose or auto-detect the programming language
3. **Generate Docs**: Click the "Generate Documentation" button
4. **Export**: Copy or download your documentation instantly

---

## 🧾 Documentation Standards

CodeScribe follows **FAANG+ level** documentation standards:

- ✅ Title and module description
- 🏗️ Architecture & dependency overview
- 🔍 Function & method-level documentation
- 📊 Performance notes
- 🔐 Security considerations
- ✨ Best practices
- 🧪 Sample code snippets

---

## 🤝 Contributing

We welcome contributions from the community!

```bash
# Steps to contribute
1. Fork the repository
2. Create your feature branch: git checkout -b feature/AmazingFeature
3. Commit your changes: git commit -m 'Add some AmazingFeature'
4. Push to the branch: git push origin feature/AmazingFeature
5. Open a Pull Request
```

---

## 📄 License

Licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.

---

## 🙏 Acknowledgments

- Built with ❤️ using powerful open-source technologies
- Thanks to the OpenRouter team for their amazing LLM API
- Inspired by the need for better, automated code documentation tools

---

<div align="center">
  <sub>Made with 💻 by <a href="https://github.com/sreedatthap">Sree Dattha P</a> | 2025</sub>
</div>
