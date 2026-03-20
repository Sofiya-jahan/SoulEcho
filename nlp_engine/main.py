import os
import sys

# Add parent directory to sys.path to allow importing nlp_engine
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from nlp_engine.src.analyzer import DiaryAnalyzer
import uvicorn

app = FastAPI(title="AI Diary NLP Engine")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

analyzer = DiaryAnalyzer()

class DiaryEntry(BaseModel):
    text: str

class TrendData(BaseModel):
    history: list[float]

@app.post("/analyze")
async def analyze(entry: DiaryEntry):
    if not entry.text.strip():
        raise HTTPException(status_code=400, detail="Diary entry text cannot be empty.")
    try:
        results = analyzer.analyze_entry(entry.text)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/trends")
async def get_trends(data: TrendData):
    try:
        trends = analyzer.analyze_trends(data.history)
        return trends
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
