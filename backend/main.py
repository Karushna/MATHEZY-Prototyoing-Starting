from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import random

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PracticeRequest(BaseModel):
    topic: str


@app.post("/generate-question")
def generate_question(req: PracticeRequest):

    # 🔢 Arithmetic
    if req.topic == "arithmetic":
        a, b = random.randint(1, 20), random.randint(1, 20)
        return {
            "question": f"{a} + {b}",
            "answer": a + b
        }

    # 🔤 Algebra (FIXED)
    elif req.topic == "algebra":
        x = random.randint(1, 10)
        b = random.randint(1, 10)

        result = x + b  # no 1x anymore

        return {
            "question": f"x + {b} = {result}",
            "answer": x
        }

    # 📐 Geometry
    elif req.topic == "geometry":
        side = random.randint(2, 10)
        return {
            "question": f"Area of square with side {side}?",
            "answer": side * side
        }

    # 📊 Stats / Probability
    elif req.topic == "stats":
        data = [random.randint(1, 10) for _ in range(5)]
        avg = sum(data) / len(data)

        return {
            "question": f"Find average of {data}",
            "answer": avg
        }

    return {"question": "Not supported", "answer": None}


# 🤖 Hint
from openai import OpenAI
import os

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class Question(BaseModel):
    question: str

@app.post("/ask-ai")
def ask_ai(q: Question):
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "user", "content": f"Give a short hint: {q.question}"}
        ]
    )

    return {"explanation": response.choices[0].message.content}


@app.get("/")
def home():
    return {"message": "Backend running"}