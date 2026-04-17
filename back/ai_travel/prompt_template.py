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