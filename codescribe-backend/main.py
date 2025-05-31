from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv
import httpx
import time

# Load API key
load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")

# FastAPI setup
app = FastAPI()

# Allow frontend calls
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic model
class CodeInput(BaseModel):
    code: str

@app.get("/")
def root():
    return {"message": "✅ CodeScribe backend is running!"}

@app.post("/generate-docs")
async def generate_docs(input: CodeInput):
    try:
        start_time = time.time()
        print("[generate-docs] Received request. Starting OpenRouter API call...")
        print(f"[generate-docs] Input code length: {len(input.code)} characters")
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }

        # Split the code into chunks if it's too long
        code_chunks = []
        chunk_size = 2000  # Adjust this based on your token limit
        
        for i in range(0, len(input.code), chunk_size):
            chunk = input.code[i:i + chunk_size]
            code_chunks.append(chunk)
            
        print(f"[generate-docs] Split code into {len(code_chunks)} chunks")
        
        # Process each chunk and combine the documentation
        all_docs = []
        for i, chunk in enumerate(code_chunks):
            print(f"[generate-docs] Processing chunk {i+1}/{len(code_chunks)}")
            
            payload = {
                "model": "mistralai/mistral-7b-instruct",
                "messages": [
                    {
                        "role": "system",
                        "content": "You are an elite engineering leader at a FAANG+ company (Google, Microsoft, Amazon, Meta, Apple, or equivalent). Generate premium, enterprise-grade documentation for this code chunk with the following requirements:\n\n1. Format: Use professional, clean formatting with:\n   - No HTML or markdown formatting\n   - No asterisks, hashtags, or other raw text markers\n   - Use proper spacing and indentation\n   - Maintain consistent formatting throughout\n   - All text should be formatted in Google Sans font\n   - Use appropriate font weights and sizes for different sections\n\n2. Structure: Include all of these sections in this exact order:\n   - Title: Clear, concise title in Google Sans font (bold)\n   - Description: Detailed technical description in Google Sans font\n   - Architecture: High-level architectural overview in Google Sans font\n   - Dependencies: List of dependencies with versions in Google Sans font\n   - Components: Detailed component breakdown in Google Sans font\n   - Methods/Functions: Comprehensive method documentation in Google Sans font\n   - Performance: Time and space complexity in Google Sans font\n   - Security: Security considerations in Google Sans font\n   - Best Practices: Enterprise-grade standards in Google Sans font\n   - Code Example: Well-formatted example in Google Sans font\n\n3. Style Requirements:\n   - Use professional terminology and technical accuracy\n   - Maintain consistent spacing and indentation\n   - Use proper bullet points for lists\n   - Use proper code formatting for examples\n   - No raw text - everything should be properly formatted\n   - All text must be in Google Sans font\n\n4. Output Format:\n   - Return the documentation as clean, professional text\n   - Ensure all code examples are properly formatted\n   - Use consistent formatting throughout\n   - Maintain FAANG+ style and professionalism\n   - All text should be in Google Sans font\n\nGenerate the documentation in a single, cohesive response that maintains the FAANG+ style and professionalism. The output should be clean, professional text without any HTML or markdown formatting, and all text should be formatted in Google Sans font."
                    },
                    {
                        "role": "user",
                        "content": f"Generate FAANG+ style documentation for chunk {i+1}/{len(code_chunks)}:\n\n{chunk}"
                    }
                ]
            }
            
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    "https://openrouter.ai/api/v1/chat/completions",
                    headers=headers,
                    json={**payload, "max_tokens": 1500},  # Increased token limit for better documentation
                )
            
            if response.status_code == 200:
                res_data = response.json()
                if "choices" in res_data and len(res_data["choices"]) > 0:
                    doc = res_data["choices"][0]["message"]["content"]
                    all_docs.append(doc)
            else:
                print(f"[generate-docs] Error processing chunk {i+1}: {response.status_code}")
                
        # Combine all documentation chunks
        if all_docs:
            doc = "\n\n".join(all_docs)
            print(f"[generate-docs] Combined documentation length: {len(doc)} characters")
            return {"documentation": doc}
        else:
            raise HTTPException(
                status_code=500,
                detail="⚠️ Failed to generate documentation for any code chunks"
            )

        payload = {
            "model": "mistralai/mistral-7b-instruct",
            "messages": [
                {
                    "role": "system",
                    "content": "You are an elite engineering leader at a FAANG+ company (Google, Microsoft, Amazon, Meta, Apple, or equivalent). Your task is to generate premium, enterprise-grade documentation for the following source code. The documentation should be formatted in Google Sans font and include:\n\n1. Title: A clear, concise title in Google Sans font\n2. Description: A detailed technical description of the code's purpose and functionality\n3. Architecture: High-level architectural overview if applicable\n4. Dependencies: List of all dependencies and their versions\n5. Components: Detailed breakdown of key components and their responsibilities\n6. Methods/Functions: Comprehensive documentation of all methods/functions including:\n   - Parameters and their types\n   - Return values and types\n   - Exceptions that may be raised\n7. Performance: Time and space complexity analysis\n8. Security: Any security considerations or best practices\n9. Best Practices: Enterprise-grade coding standards and recommendations\n10. Code Example: A clean, well-commented example of usage\n\nThe documentation should be formatted in a professional, enterprise-ready style with:\n- Clear section headings in Google Sans font\n- Proper code formatting with syntax highlighting\n- Consistent indentation and spacing\n- Professional terminology and technical accuracy\n- No raw text - all output should be properly formatted\n\nGenerate the documentation in a single, cohesive response that maintains the FAANG+ style and formatting."
                },
                {
                    "role": "user",
                    "content": f"Generate premium FAANG+ style documentation for the following code:\n\n{code}"
                }
            ]
        }

        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers=headers,
                json={**payload, "max_tokens": 150},  # Reduce max tokens to stay within limit
            )
        end_time = time.time()
        duration = end_time - start_time
        print(f"[generate-docs] OpenRouter API call completed in {duration:.2f} seconds.")

        if response.status_code == 200:
            res_data = response.json()
            print(f"[generate-docs] Full API response: {res_data}")
            
            # Check for different possible response structures
            if "choices" in res_data and len(res_data["choices"]) > 0:
                doc = res_data["choices"][0]["message"]["content"]
            elif "message" in res_data:
                doc = res_data["message"]["content"]
            elif "content" in res_data:
                doc = res_data["content"]
            else:
                raise HTTPException(
                    status_code=500, 
                    detail=f"⚠️ Invalid API response format: {res_data}"
                )
            
            print(f"[generate-docs] Documentation generated successfully. Total time: {duration:.2f} seconds.")
            print(f"[generate-docs] Generated documentation length: {len(doc)} characters")
            return {"documentation": doc}
        elif response.status_code == 408:
            print(f"[generate-docs] OpenRouter API timed out after {duration:.2f} seconds.")
            raise HTTPException(status_code=504, detail="⚠️ OpenRouter API timed out. Please try again later.")
        elif response.status_code == 402:
            res_data = response.json()
            error_msg = res_data.get("error", {}).get("message", "Unknown error")
            print(f"[generate-docs] Payment required error: {error_msg}")
            raise HTTPException(
                status_code=402,
                detail=f"⚠️ Payment required: {error_msg}"
            )
        else:
            print(f"[generate-docs] OpenRouter API error {response.status_code} after {duration:.2f} seconds: {response.text}")
            raise HTTPException(
                status_code=response.status_code,
                detail=f"⚠️ OpenRouter API Error: {response.text}"
            )

    except Exception as e:
        print(f"Error in /generate-docs: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"⚠️ Error generating documentation: {str(e)}"
        )