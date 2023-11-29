from django.apps import AppConfig
import os
from sentence_transformers import SentenceTransformer


class CppQuizConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'cpp_quiz'

    def ready(self):
        # 加载模型的代码
        model_path = os.path.join(os.path.dirname(__file__), 'my_model')
        self.model = SentenceTransformer(model_path)
