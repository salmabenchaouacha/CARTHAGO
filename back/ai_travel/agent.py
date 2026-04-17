import json
from .llm_setup import get_llm
from .prompt_template import build_prompt, build_chat_prompt

def generate_travel_plan(data):
    client = get_llm()
    prompt = build_prompt(data)
    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "system", "content": "Return ONLY valid JSON."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7
    )
    content = response.choices[0].message.content
    try:
        return json.loads(content)
    except:
        return {"error": "Invalid JSON", "raw": content}


def chat_with_plan(plan, message, history):
    client = get_llm()
    prompt = build_chat_prompt(plan, message)

    messages = [{"role": "system", "content": "You are a Tunisia travel assistant."}]
    for h in history:
        messages.append({"role": h["role"], "content": h["content"]})
    messages.append({"role": "user", "content": prompt})

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=messages,
        temperature=0.7
    )

    content = response.choices[0].message.content

    # Check if the agent returned an updated plan
    updated_plan = None
    if "<plan>" in content and "</plan>" in content:
        try:
            raw_json = content.split("<plan>")[1].split("</plan>")[0].strip()
            updated_plan = json.loads(raw_json)
            reply = content.split("<plan>")[0].strip() or "J'ai mis à jour votre itinéraire ✅"
        except:
            reply = content
    else:
        reply = content

    return {"reply": reply, "updatedPlan": updated_plan}