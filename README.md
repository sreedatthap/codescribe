# CodeScribe 📝✨

CodeScribe is an AI-powered documentation generator that helps developers create professional, FAANG+ style documentation for their codebases. Simply paste your code or upload a file, and let CodeScribe generate comprehensive documentation following enterprise-grade standards.

## Features 🚀

- **Multi-language Support**: Works with Python, Java, JavaScript and C++.
- **Smart Code Analysis**: AI-powered code understanding and documentation generation
- **File Upload**: Drag & drop or browse to upload code files
- **Export Options**: Copy to clipboard or export as text file
- **Modern UI**: Clean, responsive interface with a beautiful animated background
- **Enterprise-Grade Documentation**: Follows FAANG+ documentation standards

## Tech Stack 💻

### Frontend
- React 18
- Vite (Build Tool)
- Tailwind CSS (Styling)
- Monaco Editor (VS Code's editor)
- Framer Motion (Animations)
- Three.js + Vanta.js (Background effects)

### Backend
- FastAPI (Python web framework)
- OpenRouter API (AI documentation generation)
- HTTPX (Async HTTP client)

## Getting Started 🏁

### Prerequisites
- Node.js (v16+)
- Python 3.8+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sreedatthap/codescribe.git
   cd codescribe
   ```

2. **Set up the backend**
   ```bash
   cd codescribe-backend
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Configure environment variables**
   Create a `.env` file in the `codescribe-backend` directory:
   ```
   OPENAI_API_KEY=your_openrouter_api_key_here
   ```

4. **Set up the frontend**
   ```bash
   cd ../codescribe-frontend
   npm install
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd codescribe-backend
   uvicorn main:app --reload
   ```

2. **Start the frontend development server**
   ```bash
   cd codescribe-frontend
   npm run dev
   ```

3. **Open your browser**
   Visit `http://localhost:5173` to access CodeScribe

## Usage 📖

1. **Enter Code**: Paste your code into the editor or upload a file
2. **Select Language**: Choose the programming language (auto-detected for files)
3. **Generate Docs**: Click "Generate Documentation"
4. **Review & Export**: View the generated documentation, copy it, or export as a text file

## Documentation Standards 📚

CodeScribe generates documentation following FAANG+ standards, including:

- Title and description
- Architecture overview
- Dependencies
- Component breakdown
- Method/function documentation
- Performance analysis
- Security considerations
- Best practices
- Code examples

## Contributing 🤝

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License 📄

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments 🙏

- Built with ❤️ using amazing open-source technologies
- Special thanks to the OpenRouter team for their AI API
- Inspired by the need for better code documentation tools

---

<div align="center">
  Made with 💻 by Sree Dattha P | 2025
</div>
