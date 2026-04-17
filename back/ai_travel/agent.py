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
    import json
    client = get_llm()

    prompt = build_chat_prompt(plan, message)

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "system", "content": "Return ONLY JSON."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.3
    )

    content = response.choices[0].message.content

    try:
        data = json.loads(content)
    except:
        return {"reply": "Invalid JSON", "updatedPlan": None}

    action = data.get("action")

    # -------------------
    # MESSAGE ONLY
    # -------------------
    if action == "message":
        return {
            "reply": data["reply"],
            "updatedPlan": None
        }

    # -------------------
    # UPDATE FULL DAY
    # -------------------
    if action == "update_day":
        day_index = data["day"] - 1

        if 0 <= day_index < len(plan["days"]):
            plan["days"][day_index] = data["new_day"]

        plan["totalCost"] = data.get("new_total_cost", plan["totalCost"])

        return {
            "reply": "Plan mis à jour avec cohérence ✅",
            "updatedPlan": plan
        }

    # -------------------
    # ADD DAY
    # -------------------
    if action == "add_day":
        plan["days"].append(data["new_day"])

        plan["days"] = sorted(plan["days"], key=lambda x: x["day"])

        plan["totalCost"] = data.get("new_total_cost", plan["totalCost"])

        return {
            "reply": "Jour ajouté avec plan complet ✅",
            "updatedPlan": plan
        }

    return {
        "reply": "Unknown action",
        "updatedPlan": None
    }