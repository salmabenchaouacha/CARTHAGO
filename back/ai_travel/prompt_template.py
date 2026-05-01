def build_prompt(data):
    return f"""
You are a luxury travel planner specialized in Tunisia.

Create a detailed day-by-day travel itinerary.

Trip Details:
- Duration: {data.get('duration')}
- Travel Type: {data.get('travel_type')}
- Interests: {data.get('interests')}
- Preferred Regions: {data.get('regions')}

GEOGRAPHIC RULES:
- Tunis → Carthage, Sidi Bou Said, Bardo, Medina only
- Djerba → Houmt Souk, Midoun, Guellala only
- Tozeur → Chott el-Jérid, Nefta, Ong Jemel only
- Hammamet → Yasmine quarter, Medina, Nabeul coast only
- Sousse -> Port El Kantaoui, Medina (Ribat), L'Aromate Restaurent Town
- Do NOT combine geographically distant regions in the same day
- Maximum 2 regions per trip if duration < 5 days
- The activities of each day should make sense with each other and with the region of the day.
- The estimated cost of each day should make total sense with the activities and accommodation of the day.
- the total cost should be the sum of the days cost.
- If user doesn't specify regions, choose them based on their interests and the duration of the trip.

CRITICAL: Return ONLY a raw JSON object. No markdown, no backticks, no explanation.

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
You are a travel itinerary engine for Tunisia.

CURRENT PLAN:
{json.dumps(plan, ensure_ascii=False, indent=2)}

USER REQUEST: {message}

DECISION LOGIC:
1. Use 'add_day' if the user mentions a NEW location not in the CURRENT PLAN, or explicitly says "add a day", "add [City]", or "extension".
2. Use 'update_day' ONLY if the user references an EXISTING day number (e.g., "Change day 2") or wants to modify a specific activity already listed.
3. If the user says "Add [City]" without specifying a day number, it is ALWAYS 'add_day'. The new day number must be CURRENT PLAN max day + 1.

RULES:
- Return ONLY a raw JSON object. No markdown. No backticks. No explanation.
- Always recompute new_total_cost.
- Never place regions more than 200km apart on the same day.
- The activities of each day should make sense with each other and with the region of the day.
- The estimated cost of each day should make total sense with the activities and accommodation of the day.
- The cost of a day should be the sum of the accommodation cost and the activities cost.
- the total cost should be the sum of the days cost.

CHOOSE EXACTLY ONE action and return its JSON:

--- ACTION: update_day ---
Use when user modifies, adds activities to, or changes ANY detail of an existing day.
{{
  "action": "update_day",
  "day": <day_number>,
  "new_day": {{
    "day": <day_number>,
    "region": "...",
    "weather": {{"temp": 26, "condition": "..."}},
    "activities": [{{"time": "09:00", "title": "...", "description": "..."}}],
    "accommodation": "...",
    "estimatedCost": 180
  }},
  "new_total_cost": 720
}}

--- ACTION: add_day (SINGLE day) ---
Use when user adds ONE day.
{{
  "action": "add_day",
  "new_day": {{
    "day": <next_day_number>,
    "region": "...",
    "weather": {{"temp": 25, "condition": "..."}},
    "activities": [{{"time": "09:00", "title": "...", "description": "..."}}],
    "accommodation": "...",
    "estimatedCost": 150
  }},
  "new_total_cost": 900
}}

--- ACTION: add_day (MULTIPLE days) ---
Use when user adds MORE THAN ONE day. Put all new days in new_days array.
{{
  "action": "add_day",
  "new_days": [
    {{
      "day": <next_day_number>,
      "region": "Sousse",
      "weather": {{"temp": 27, "condition": "Ensoleillé"}},
      "activities": [{{"time": "09:00", "title": "...", "description": "..."}}],
      "accommodation": "...",
      "estimatedCost": 160
    }},
    {{
      "day": <next_day_number_plus_1>,
      "region": "Kairouan",
      "weather": {{"temp": 28, "condition": "Ensoleillé"}},
      "activities": [{{"time": "09:00", "title": "...", "description": "..."}}],
      "accommodation": "...",
      "estimatedCost": 130
    }}
  ],
  "new_total_cost": 1050
}}

--- ACTION: remove_day ---
Use when user removes/deletes a day.
{{
  "action": "remove_day",
  "day": <day_number>,
  "new_total_cost": 650
}}

--- ACTION: message ---
Use ONLY when no plan change is needed (e.g. a question).
{{
  "action": "message",
  "reply": "..."
}}
"""