import os
from groq import Groq

def get_llm():
    api_key = os.getenv("GROQ_API_KEY")
    print("GROQ KEY:", api_key)  # 👈 DEBUG

    client = Groq(api_key=api_key)
    return client