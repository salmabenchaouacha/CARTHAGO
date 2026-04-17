from rest_framework.decorators import api_view
from rest_framework.response import Response
from .agent import generate_travel_plan, chat_with_plan

@api_view(['POST'])
def travel_plan(request):
    data = request.data
    plan = generate_travel_plan(data)
    return Response({"plan": plan})

@api_view(['POST'])
def chat_plan(request):
    plan = request.data.get("plan")
    message = request.data.get("message")
    history = request.data.get("history", [])
    result = chat_with_plan(plan, message, history)
    return Response(result)