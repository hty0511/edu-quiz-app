from django.apps import AppConfig
import os
import json
from sentence_transformers import SentenceTransformer


class CppQuizConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'cpp_quiz'

    def ready(self):
        model_path = os.path.join(os.path.dirname(__file__), 'my_model')
        self.model = SentenceTransformer(model_path)

        file_path = os.path.join(os.path.dirname(__file__), 'bug_library.json')
        with open(file_path, 'r') as file:
            self.bug_library = json.load(file)
