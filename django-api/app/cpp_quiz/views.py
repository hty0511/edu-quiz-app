import json
from rest_framework.views import APIView
from rest_framework.response import Response
from django.apps import apps
from sentence_transformers import util
from django.http import JsonResponse


cpp_quiz_config = apps.get_app_config('cpp_quiz')


class SystemFeedbackView(APIView):
    def post(self, request, *args, **kwargs):
        model = cpp_quiz_config.model
        bug_library = cpp_quiz_config.bug_library
        week = request.data.week
        round = request.data.round

        if request.data.isCorrect:
            user_reasoning = request.data.userReasoning
            correct_reasoning = request.data.correctReasoning

            embeddings = model.encode([user_reasoning, correct_reasoning], convert_to_tensor=True)
            cosine_scores = util.pytorch_cos_sim(embeddings[0], embeddings[1])

            if cosine_scores.item() >= 0.7:
                system_feedback = '你作答的很好，請繼續保持!'
            else:
                system_feedback = bug_library[f'week{week}'][f'r{round}']['default']
        else:
            user_answers = request.data.userAnswers

            if json.dumps(user_answers) in bug_library[f'week{week}'][f'r{round}']:
                system_feedback = bug_library[f'week{week}'][f'r{round}'][json.dumps(user_answers)]
            else:
                system_feedback = bug_library[f'week{week}'][f'r{round}']['default']

        return JsonResponse({"systemFeedback": system_feedback})
