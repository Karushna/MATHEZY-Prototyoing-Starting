from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables
load_dotenv()

app = FastAPI()

# Enable CORS (allow frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load API key
api_key = os.getenv("OPENAI_API_KEY")
print("Loaded API Key:", api_key)  # DEBUG

# Initialize OpenAI
client = OpenAI(api_key=api_key)


# -------- Request Model --------
class Question(BaseModel):
    question: str


# -------- AI Endpoint --------
@app.post("/ask-ai")
def ask_ai(q: Question):
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",  # ✅ stable model
            messages=[
                {
                    "role": "user",
                    "content": f"Solve this step by step: {q.question}"
                }
            ]
        )

        answer = response.choices[0].message.content
        print("AI RESPONSE:", answer)

        return {
            "explanation": answer
        }

    except Exception as e:
        print("ERROR:", str(e))
        return {
            "error": str(e)
        }


# -------- Test Route --------
@app.get("/")
def home():
    return {"message": "Backend is running"}

import random

class PracticeRequest(BaseModel):
    topic: str
    difficulty: str

@app.post("/generate-question")
def generate_question(req: PracticeRequest):

    if req.topic == "algebra":
        x = random.randint(1, 10)
        a = random.randint(1, 5)
        b = random.randint(1, 10)

        result = a * x + b

        return {
            "question": f"Solve: {a}x + {b} = {result}",
            "answer": x
        }

    elif req.topic == "arithmetic":
        a = random.randint(1, 20)
        b = random.randint(1, 20)

        return {
            "question": f"{a} + {b}",
            "answer": a + b
        }

    return {
        "question": "Topic not supported",
        "answer": None
    }