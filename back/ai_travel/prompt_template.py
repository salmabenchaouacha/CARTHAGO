def build_prompt(data, sponsors=None):
    duration = data.get('duration')
    travel_type = data.get('travel_type')
    interests = data.get('interests')
    regions = data.get('regions')
    traveler_profile = data.get('traveler_profile', 'couple')
    budget_level = data.get('budget_level', 'mid-range')
    language = data.get('language', 'fr')
    season = data.get('season', 'summer')
    special_requests = data.get('special_requests', '')

    # ── REGION RULE ─────────────────────────────────────────
    if regions and len(regions) > 0:
        regions_list = regions if isinstance(regions, list) else [regions]
        regions_str = ", ".join(regions_list)

        if len(regions_list) == 1:
            region_rule = f"""
REGION ENFORCEMENT:
ALL {duration} days MUST be in [{regions_str}] only.
No other region allowed.
"""
        else:
            region_rule = f"""
REGION ENFORCEMENT:
Distribute {duration} days across ONLY: [{regions_str}]
Each day = ONE region only (no mixing).
"""
    else:
        region_rule = f"""
REGION SELECTION:
Choose best regions based on interests and season.
Max 2 regions if duration < 5.
"""

    # ── CONTEXTS ────────────────────────────────────────────
    profile_context = {
        'solo': "Solo traveler → social & safe.",
        'couple': "Couple → romantic & intimate.",
        'family': "Family → safe & child-friendly.",
        'group': "Group → shared experiences.",
        'business': "Business → efficient & central.",
    }.get(traveler_profile, '')

    budget_context = {
        'budget': "Low budget.",
        'mid-range': "Mid-range comfort.",
        'luxury': "Luxury experience.",
    }.get(budget_level, '')

    season_context = {
        'spring': "Spring activities.",
        'summer': "Avoid heat, beach evenings.",
        'autumn': "Balanced season.",
        'winter': "Indoor + desert.",
    }.get(season, '')

    # ── SIZE CONTROL (CRITICAL) ─────────────────────────────
    size_rules = f"""
OUTPUT SIZE RULES (STRICT):
- EXACTLY {duration} days
- MAX 3 activities/day
- EXACTLY 2 shopping items/day

TEXT LIMITS:
- narrative: max 2 short sentences
- description: max 12 words
- insider_tip: max 10 words
- accommodation desc: max 15 words
- why_buy: max 12 words

STYLE:
- concise, useful, non-repetitive
- no long paragraphs
"""

    # ── PROMPT ─────────────────────────────────────────────
    return f"""
You are a Tunisia travel planner generating STRICT JSON.

{size_rules}

USER:
- Duration: {duration}
- Interests: {interests}
- Profile: {traveler_profile} ({profile_context})
- Budget: {budget_level} ({budget_context})
- Season: {season} ({season_context})
{region_rule}

RULES:
- Always valid JSON
- No markdown
- No explanations
- Short content only
- Realistic places only

JSON STRUCTURE:

{{
  "trip_summary": {{
    "title": "...",
    "tagline": "...",
    "traveler_profile": "{traveler_profile}",
    "budget_level": "{budget_level}",
    "season": "{season}",
    "regions": [],
    "total_days": {duration}
  }},
  "days": [
    {{
      "day": 1,
      "region": "...",
      "daily_narrative": "...",
      "weather": {{
        "temp": 30,
        "condition": "sunny",
        "advice": "..."
      }},
      "activities": [
        {{
          "time": "09:00",
          "title": "...",
          "description": "Short description.",
          "insider_tip": "Short tip.",
          "duration_minutes": 90,
          "cost_per_person": 10,
          "category": "culture",
          "sponsor": null
        }}
      ],
      "shopping_recommendations": [
        {{
          "name": "...",
          "shop": "...",
          "address": "...",
          "price_range": "...",
          "why_buy": "Short reason.",
          "availability": "both",
          "sponsored": false
        }}
      ],
      "accommodation": {{
        "name": "...",
        "type": "guest_house",
        "description": "Short description.",
        "unique_character": "Short highlight.",
        "is_sponsor": false,
        "price_per_night": 120,
        "address": "...",
        "booking_tip": "..."
      }},
      "estimatedCost": 200
    }}
  ],
  "totalCost": 600
}}
"""

def build_chat_prompt(plan, message):
    import json

    return f"""
You are a STRICT JSON travel plan editor.

IMPORTANT RULES:
- Return ONLY valid JSON
- NEVER break the structure
- ALWAYS keep same schema
- ALWAYS return FULL objects when updating

CONSTRAINTS:
- MAX 3 activities per day
- EXACTLY 2 shopping_recommendations per day
- Keep all required fields
- No new fields

IF USER MESSAGE IS NOT CLEAR:
→ action = "message"

IF MODIFYING A DAY:
→ return FULL "new_day" object

CURRENT PLAN:
{json.dumps(plan, ensure_ascii=False)}

USER MESSAGE:
{message}

OUTPUT FORMAT:

{{
  "action": "message" | "update_day" | "add_day" | "remove_day",
  "reply": "short answer",

  "day": 1,
  "new_day": {{ FULL DAY OBJECT }},
  "new_days": [{{ FULL DAY OBJECT }}],
  "new_total_cost": 0
}}

NO TEXT OUTSIDE JSON.
"""