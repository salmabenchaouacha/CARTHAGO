import json
import re
from .llm_setup import get_llm
from .prompt_template import build_prompt, build_chat_prompt


def _parse_json(content: str):
    """Strip markdown fences and parse JSON robustly."""
    # Remove ```json ... ``` or ``` ... ``` wrappers
    cleaned = re.sub(r"^```(?:json)?\s*", "", content.strip(), flags=re.IGNORECASE)
    cleaned = re.sub(r"\s*```$", "", cleaned.strip())
    return json.loads(cleaned)


def generate_travel_plan(data):
    client = get_llm()
    prompt = build_prompt(data)
    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "system", "content": "Return ONLY valid JSON. No markdown, no explanation, no backticks."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7
    )
    content = response.choices[0].message.content
    try:
        return _parse_json(content)
    except Exception as e:
        return {"error": "Invalid JSON", "raw": content, "detail": str(e)}


def chat_with_plan(plan, message, history):
    client = get_llm()
    prompt = build_chat_prompt(plan, message)

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "system", "content": "Return ONLY valid JSON. No markdown, no explanation, no backticks."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.3
    )

    content = response.choices[0].message.content

    try:
        data = _parse_json(content)
    except Exception as e:
        return {"reply": f"Parsing error: {str(e)}", "updatedPlan": None}

    action = data.get("action")

    # ── MESSAGE ONLY ──────────────────────────────
    if action == "message":
        return {
            "reply": data.get("reply", ""),
            "updatedPlan": None
        }

    # ── UPDATE FULL DAY ───────────────────────────
    if action == "update_day":
        day_index = data["day"] - 1
        if 0 <= day_index < len(plan["days"]):
            plan["days"][day_index] = data["new_day"]
        plan["totalCost"] = data.get("new_total_cost", plan["totalCost"])
        return {
            "reply": "Jour mis à jour ✅",
            "updatedPlan": plan
        }

    # ── ADD DAY ───────────────────────────────────
    if action == "add_day":
        new_days = data.get("new_days") or ([data["new_day"]] if data.get("new_day") else [])
        for new_day in new_days:
            # Assign correct day number
            new_day["day"] = len(plan["days"]) + 1
            plan["days"].append(new_day)
        plan["totalCost"] = data.get("new_total_cost", plan["totalCost"])
        count = len(new_days)
        return {
            "reply": f"{count} jour(s) ajouté(s) ✅",
            "updatedPlan": plan
        }

    # ── REMOVE DAY ────────────────────────────────
    if action == "remove_day":
        day_number = data.get("day")
        if day_number is not None:
            plan["days"] = [d for d in plan["days"] if d["day"] != day_number]
            # Re-number remaining days sequentially
            for i, d in enumerate(plan["days"]):
                d["day"] = i + 1
        plan["totalCost"] = data.get("new_total_cost", plan["totalCost"])
        return {
            "reply": f"Jour {day_number} supprimé ✅",
            "updatedPlan": plan
        }

    return {
        "reply": f"Action non reconnue : {action}",
        "updatedPlan": None
    }