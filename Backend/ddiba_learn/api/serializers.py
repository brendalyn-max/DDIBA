from rest_framework import serializers
from .models import LearnerProfile


class PreferencesSerializer(serializers.Serializer):
    short_explanations = serializers.BooleanField(default=True)
    step_by_step = serializers.BooleanField(default=True)
    examples = serializers.BooleanField(default=True)

    larger_text = serializers.BooleanField(default=False)
    more_spacing = serializers.BooleanField(default=False)
    shorter_paragraphs = serializers.BooleanField(default=False)
    highlight_words = serializers.BooleanField(default=False)
    read_aloud = serializers.BooleanField(default=False)

    pace = serializers.CharField(default="gentle")


class AdaptLessonSerializer(serializers.Serializer):
    text = serializers.CharField()
    preferences = PreferencesSerializer(required=False)


class PracticeQuestionsSerializer(serializers.Serializer):
    adapted_text = serializers.CharField()


class EvaluateAnswerSerializer(serializers.Serializer):
    question = serializers.CharField()
    student_answer = serializers.CharField()
    reference_answer = serializers.CharField()


class LearnerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = LearnerProfile
        fields = [
            "id",
            "short_explanations",
            "step_by_step",
            "examples",
            "larger_text",
            "more_spacing",
            "shorter_paragraphs",
            "highlight_words",
            "read_aloud",
            "pace",
            "learning_goal",
            "questions_answered",
            "strong_topics",
            "weak_topics",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "questions_answered",
            "strong_topics",
            "weak_topics",
            "created_at",
            "updated_at",
        ]