from django.urls import path
from .views import SystemFeedbackView

app_name = 'cpp_quiz'

urlpatterns = [
    path('feedback/', SystemFeedbackView.as_view(), name='feedback'),
]
