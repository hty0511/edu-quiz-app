from rest_framework.views import APIView
from rest_framework.response import Response
from django.apps import apps
from sentence_transformers import util
from django.http import JsonResponse


cpp_quiz_config = apps.get_app_config('cpp_quiz')


class SystemFeedbackView(APIView):
    def post(self, request, *args, **kwargs):
        model = cpp_quiz_config.model

        s1 = '在這個風和日麗的早晨，我們決定一同前往郊外的湖邊，那裡的風景如畫，湖水清澈見底，周圍的綠意盎然和花香四溢，讓人感到放鬆和愉悅。'
        s2 = '這個晴朗的下午，一群朋友興致勃勃地計劃去郊外踏青，目的地是一個風景宜人的小湖，它周圍環繞著茂密的樹木和五彩斑斕的野花，為人們提供了一個完美的逃離城市喧囂的地方。'
        embeddings = model.encode([s1, s2], convert_to_tensor=True)

        cosine_scores = util.pytorch_cos_sim(embeddings[0], embeddings[1])

        return JsonResponse({"systemFeedback": "feedback from django api", "sim": cosine_scores.item()})
