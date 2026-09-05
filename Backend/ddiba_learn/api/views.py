from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import LearnerProfile
from .serializers import (
    AdaptLessonSerializer,
    EvaluateAnswerSerializer,
    LearnerProfileSerializer,
    PracticeQuestionsSerializer,
)


@api_view(["POST"])
def adapt_lesson(request):
    serializer = AdaptLessonSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    text = serializer.validated_data["text"]
    preferences = serializer.validated_data.get("preferences", {})

    simplified_text = (
        "This is a temporary adapted version of the lesson. "
        "Later, the LLM will simplify the vocabulary, shorten sentences, "
        "break content into smaller chunks, and explain difficult terms."
    )

    key_points = [
        "The lesson text was received successfully.",
        "The learner preferences were received successfully.",
        f"Original text length: {len(text)} characters.",
        f"Preferences received: {preferences}",
    ]

    return Response(
        {
            "simplified_text": simplified_text,
            "key_points": key_points,
        },
        status=status.HTTP_200_OK,
    )


@api_view(["POST"])
def practice_questions(request):
    serializer = PracticeQuestionsSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    adapted_text = serializer.validated_data["adapted_text"]

    questions = [
        {
            "question": "What is the main idea of this lesson?",
            "type": "free_text",
            "reference_answer": "The learner should explain the main idea in their own words.",
        },
        {
            "question": "Which statement best matches the lesson?",
            "type": "multiple_choice",
            "options": [
                "Option A",
                "Option B",
                "Option C",
                "Option D",
            ],
            "reference_answer": "Option B",
        },
    ]

    return Response(
        {
            "source_length": len(adapted_text),
            "questions": questions,
        },
        status=status.HTTP_200_OK,
    )


@api_view(["POST"])
def evaluate_answer(request):
    serializer = EvaluateAnswerSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    question = serializer.validated_data["question"]
    student_answer = serializer.validated_data["student_answer"]
    reference_answer = serializer.validated_data["reference_answer"]

    student_normalized = student_answer.strip().lower()
    reference_normalized = reference_answer.strip().lower()

    correct = student_normalized == reference_normalized

    if correct:
        feedback = "Good work. Your answer matches the expected answer."
    else:
        feedback = (
            "Your answer is not an exact match yet. "
            "Later, the LLM will judge answers semantically and give more helpful feedback."
        )

    return Response(
        {
            "question": question,
            "correct": correct,
            "feedback": feedback,
        },
        status=status.HTTP_200_OK,
    )


@api_view(["GET", "PATCH"])
def learner_profile(request):
    if not request.user.is_authenticated:
        return Response(
            {
                "detail": "Authentication is required for learner profile access."
            },
            status=status.HTTP_401_UNAUTHORIZED,
        )

    profile, _ = LearnerProfile.objects.get_or_create(user=request.user)

    if request.method == "GET":
        serializer = LearnerProfileSerializer(profile)
        return Response(serializer.data)

    serializer = LearnerProfileSerializer(
        profile,
        data=request.data,
        partial=True,
    )

    serializer.is_valid(raise_exception=True)
    serializer.save()

    return Response(serializer.data)


@api_view(["GET"])
def test_api(request):
    return Response({
        "message": "Ddiba backend is connected successfully"
    })