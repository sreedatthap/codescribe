import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import './App.css';
import * as THREE from 'three';
import Editor from '@monaco-editor/react';
import { saveAs } from 'file-saver';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const defaultSnippets = {
  python: `def hello_world():\n    print("Hello, Python!")`,
  java: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, Java!");\n    }\n}`,
  javascript: `function greet() {\n  console.log("Hello, JavaScript!");\n}`,
  cpp: `#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Hello, C++!" << endl;\n    return 0;\n}`,
};

function App() {
  const vantaRef = useRef(null);
  const editorRef = useRef(null);
  const dropRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState(defaultSnippets['python']);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [doc, setDoc] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [codeCopyMessage, setCodeCopyMessage] = useState('');
  const [docCopyMessage, setDocCopyMessage] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const dropArea = dropRef.current;
  
    const handleDragOver = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
    };

    const handleDragLeave = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
    };

    const handleDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFileUpload(e.dataTransfer.files[0]);
        e.dataTransfer.clearData();
      }
    };

    dropArea.addEventListener('dragover', handleDragOver);
    dropArea.addEventListener('dragleave', handleDragLeave);
    dropArea.addEventListener('drop', handleDrop);

    return () => {
      dropArea.removeEventListener('dragover', handleDragOver);
      dropArea.removeEventListener('dragleave', handleDragLeave);
      dropArea.removeEventListener('drop', handleDrop);
    };
  }, []);

  useEffect(() => {
    if (!vantaEffect && window.VANTA) {
      setVantaEffect(
        window.VANTA.NET({
          el: vantaRef.current,
          THREE,
          mouseControls: true,
          touchControls: true,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          color: 0x7f00ff,
          backgroundColor: 0x1b1b1b,
        })
      );
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setLanguage(lang);
    setCode(defaultSnippets[lang]);
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/generate-docs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate documentation');
      }

      const data = await response.json();
      setDoc(data.documentation || '⚠️ No documentation returned.');
    } catch (error) {
      toast.error('❌ Failed to generate documentation. Please try again.');
      console.error('Error:', error);
      setDoc('⚠️ Error generating documentation.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCodeCopyMessage('✅ Code copied to clipboard!');
    setTimeout(() => setCodeCopyMessage(''), 2000);
  };

  const handleCopyDoc = () => {
    navigator.clipboard.writeText(doc);
    setDocCopyMessage('✅ Doc info copied to clipboard!');
    setTimeout(() => setDocCopyMessage(''), 2000);
  };

  const handleExportDocTXT = () => {
    const docContent = `
      ===========================
      Documentation for ${language.toUpperCase()} Code:
      ===========================

      ${doc}
    `;
    const blob = new Blob([docContent], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `documentation-${language}.txt`);
  };

  const handleFileUpload = (file) => {
  if (!file) return;
  setUploadedFileName(file.name);
    if (!file) return;

    const validFileTypes = ['py', 'java', 'js', 'cpp', 'txt'];
    const maxSizeInMB = 5; // 5 MB
    const fileSizeMB = file.size / 1024 / 1024;
    const fileExt = file.name.split('.').pop().toLowerCase();

    if (!validFileTypes.includes(fileExt)) {
      toast.error('❌ Unsupported file type. Please upload .py, .java, .js, .cpp, or .txt');
      return;
    }

    if (fileSizeMB > maxSizeInMB) {
      toast.error(`❌ File size exceeds ${maxSizeInMB}MB. Please upload a smaller file.`);
      return;
    }

    setUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      const langMap = {
        py: 'python',
        java: 'java',
        js: 'javascript',
        cpp: 'cpp',
        c: 'cpp',
        txt: null, // We'll detect this below
      };

      let detectedLang = langMap[fileExt];
      if (fileExt === 'txt') {
        // Heuristics for language detection
        if (/\b(def |import |print\(|self|class )/.test(content)) {
          detectedLang = 'python';
        } else if (/\b(public |static |void |System\.out|class )/.test(content)) {
          detectedLang = 'java';
        } else if (/\b(function |var |let |const |console\.|document\.|=>)/.test(content)) {
          detectedLang = 'javascript';
        } else if (/\b(#include |std::|cout|cin|int main\s*\()/i.test(content)) {
          detectedLang = 'cpp';
        } else {
          detectedLang = 'plaintext';
        }
      }

      if (detectedLang) {
        setLanguage(detectedLang);
        setCode(content);
        toast.success('File uploaded successfully!');
      } else {
        toast.error('❌ Could not detect language. Showing as plain text.');
        setLanguage('plaintext');
        setCode(content);
      }
    };
    reader.readAsText(file);
    setUploading(false);
  };

  const handleRemoveUpload = () => {
    setCode('');
    setUploadedFileName('');
    // Optionally reset language to default
    // setLanguage('python');
    // Reset file input value
    if (dropRef.current) {
      const fileInput = dropRef.current.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
    }
  };

  const Button = ({ onClick, children, className }) => (
    <button onClick={onClick} className={`px-4 py-2 rounded-lg transition ${className}`}>
      {children}
    </button>
  );

  return (
    <motion.div
      ref={vantaRef}
      className="flex h-screen w-screen font-mono bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden text-white p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Left Panel */}
      <motion.div className="w-1/2 p-6 flex flex-col gap-4 bg-black/60 backdrop-blur-md shadow-3d rounded-2xl">
        <h1 className="text-xl font-bold text-white">
          Type/Upload your Code here... 💻
        </h1>

        <div
          ref={dropRef}
          className={`border border-dashed rounded-lg p-2 text-base transition-all duration-300 ${
            isDragging ? 'border-green-400 bg-green-900/10' : 'border-gray-600 bg-gray-800/30'
          }`}
        >
          <p className="text-gray-200 text-center">🗂️ Drag and drop your code file here, or select manually</p>

          <div className="flex items-center gap-2 mt-2 justify-center">
  <label htmlFor="file-upload" className="cursor-pointer bg-violet-600 hover:bg-violet-500 text-white px-3 py-1.5 rounded-lg text-base font-semibold transition" style={{lineHeight: '1.2'}}>
    Choose File
    <input
      id="file-upload"
      type="file"
      accept=".py,.java,.js,.cpp"
      onChange={(e) => handleFileUpload(e.target.files[0])}
      className="hidden"
    />
  </label>
  {uploadedFileName && (
    <>
      <span className="truncate text-base text-gray-200 font-medium max-w-[160px]">{uploadedFileName}</span>
      <button
        onClick={handleRemoveUpload}
        className="text-gray-400 hover:text-red-400 text-base px-1 py-0 rounded-full focus:outline-none font-medium"
        title="Remove uploaded file"
        style={{ lineHeight: '1', height: '20px', width: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <span style={{fontWeight: 'bold', fontSize: '18px', display: 'block', padding: 0, margin: 0}}>X</span>
      </button>
    </>
  )}
</div>
        </div>

        {/* Language Selector */}
        <select
          value={language}
          onChange={handleLanguageChange}
          className="bg-gray-800 text-white px-4 py-2 rounded-lg outline-none focus:ring-2 ring-gray-600 transition"
        >
          <option value="python">🐍 Python</option>
          <option value="java">☕ Java</option>
          <option value="javascript">🟨 JavaScript</option>
          <option value="cpp">🚀 C++</option>
        </select>

        {/* Code Editor */}
        <Editor
          height="500px"
          defaultLanguage={language}
          value={code}
          theme="vs-dark"
          options={{ fontSize: 15 }}
          onChange={(newValue) => setCode(newValue || '')}
        />

        {/* Button to Generate Doc */}
        <Button onClick={handleGenerate} className="bg-violet-600 hover:bg-violet-500 text-white border border-gray-400">
          {isLoading ? 'Generating...' : 'Generate Doc'}
        </Button>
      </motion.div>

      {/* Right Panel */}
      <motion.div className="w-1/2 p-6 flex flex-col gap-4 bg-black/60 backdrop-blur-md shadow-3d rounded-2xl">
        <h1 className="text-xl font-bold text-white">
          Generated Documentation 📝
        </h1>

        <div className="flex-1 min-h-0 flex flex-col">
          {isLoading ? (
            <div className="flex flex-1 items-center justify-center w-full">
              <div className="italic text-gray-350 text-lg opacity-100 select-none">Generating...</div>
            </div>
          ) : doc ? (
            <div className="overflow-auto h-[500px] bg-gray-800/50 rounded-lg p-4">
              <pre className="whitespace-pre-wrap break-words">{doc}</pre>
            </div>
          ) : (
            <div className="flex flex-1 items-center justify-center w-full">
              <span className="italic text-gray-350 text-lg opacity-100 select-none">Documentation will appear here..</span>
            </div>
          )}
        </div>

        {doc && (
          <div className="flex gap-4 items-center">
            {/* Button to Copy Docs */}
            <Button onClick={handleCopyDoc} className="bg-violet-600 hover:bg-violet-500 text-white border border-gray-400 h-10">
              {docCopyMessage || 'Copy Docs'}
            </Button>
            {/* Button to Export Docs */}
            <Button onClick={handleExportDocTXT} className="bg-green-600 hover:bg-green-500 text-white h-10">
              Export Docs
            </Button>
          </div>
        )}
      </motion.div>

      <ToastContainer />
    </motion.div>
  );
}

export default App;
