from django.urls import path
from .views import travel_plan, chat_plan

urlpatterns = [
    path('generate-plan/', travel_plan),
    path('chat-plan/', chat_plan),

]