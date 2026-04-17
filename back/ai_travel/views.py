from rest_framework.decorators import api_view
from rest_framework.response import Response
from .agent import generate_travel_plan

@api_view(['POST'])
def travel_plan(request):
    data = request.data

    plan = generate_travel_plan(data)

    return Response({
        "plan": plan
    })