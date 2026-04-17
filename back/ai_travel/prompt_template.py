def build_prompt(data):
    return f"""
You are a luxury travel planner specialized in Tunisia.

Create a detailed day-by-day travel itinerary.

Trip Details:
- Duration: {data.get('duration')}
- Travel Type: {data.get('travel_type')}
- Interests: {data.get('interests')}
- Preferred Regions: {data.get('regions')}

IMPORTANT:
Return ONLY valid JSON.
Do NOT add explanations.

Use exactly this structure:

{{
  "days": [
    {{
      "day": 1,
      "region": "Tunis",
      "weather": {{
        "temp": 25,
        "condition": "Ensoleillé"
      }},
      "activities": [
        {{
          "time": "09:00",
          "title": "Visite de la Médina",
          "description": "Exploration de la vieille ville historique"
        }}
      ],
      "accommodation": "Hôtel Dar El Jeld",
      "estimatedCost": 120
    }}
  ],
  "totalCost": 500
}}
"""
def build_chat_prompt(plan, message):
    import json

    return f"""
You are a TRAVEL ITINERARY ENGINE.

CURRENT PLAN:
{json.dumps(plan, ensure_ascii=False, indent=2)}

USER REQUEST:
{message}

You MUST return ONLY JSON.

Rules:

1) If user modifies a day → you MUST regenerate the FULL day object
(not only one field)

2) If user adds a day → create FULL realistic day

3) If user changes budget → you MUST recalculate:
- estimatedCost of affected day
- totalCost of entire plan

---

Return format:

{{
  "action": "update_day",
  "day": 4,
  "new_day": {{
    "day": 4,
    "region": "Tunis",
    "weather": {{
      "temp": 26,
      "condition": "Ensoleillé"
    }},
    "activities": [
      {{
        "time": "09:00",
        "title": "...",
        "description": "..."
      }}
    ],
    "accommodation": "...",
    "estimatedCost": 180
  }},
  "new_total_cost": 720
}}

OR

{{
  "action": "add_day",
  "new_day": {{ ...full object... }},
  "new_total_cost": 900
}}

OR

{{
  "action": "message",
  "reply": "text"
}}

IMPORTANT:
- Always return FULL structured day
- Always recompute cost
- No partial edits
"""