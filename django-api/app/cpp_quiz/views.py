from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse

class SystemFeedbackView(APIView):
    def post(self, request, *args, **kwargs):
        # 处理 POST 请求
        received_data = request.data
        # 这里可以根据需要处理 received_data
        return JsonResponse({"systemFeedback": "feedback from django api"})