from fastapi import FastAPI

app = FastAPI(title="EduPromptAI")


@app.get("/")
def root():
    return {"status": "EduPromptAI"}
  
