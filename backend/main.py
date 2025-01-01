from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from backend.functions.checker import preprocess_code, calculate_cosine_similarity

app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Health Check Success"}

@app.post("/detect-plagiarism/")
async def detect_plagiarism(file1: UploadFile = File(...), file2: UploadFile = File(...)):
    try:
        code1 = (await file1.read()).decode("utf-8")
        code2 = (await file2.read()).decode("utf-8")

        original_code_preprocessed = preprocess_code(code1)
        suspected_code_preprocessed = preprocess_code(code2)

        cosine_sim = calculate_cosine_similarity(original_code_preprocessed, suspected_code_preprocessed)
        threshold = 0.8

        if cosine_sim > threshold:
            result = f"Plagiarisme Terdeteksi"
        else:
            result = "Kode Kemungkinan Tidak Plagiarisme."
        
        return {"cosine_similarity": cosine_sim, "result": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))