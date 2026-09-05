from django.shortcuts import render
from django.contrib.auth.models import User

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
from .llm_service import (
    adapt_lesson_with_ai,
    generate_practice_questions_with_ai,
    evaluate_answer_with_ai,
    LLMServiceError,
)

@api_view(["POST"])
def adapt_lesson(request):
    serializer = AdaptLessonSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    text = serializer.validated_data["text"]
    preferences = serializer.validated_data.get("preferences", {})

    try:
        result = adapt_lesson_with_ai(
            text=text,
            preferences=preferences,
        )

    except LLMServiceError as exc:
        return Response(
            {
                "detail": str(exc),
            },
            status=status.HTTP_502_BAD_GATEWAY,
        )

    return Response(
        result,
        status=status.HTTP_200_OK,
    )


@api_view(["POST"])
def practice_questions(request):
    serializer = PracticeQuestionsSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    adapted_text = serializer.validated_data["adapted_text"]

    try:
        result = generate_practice_questions_with_ai(
            adapted_text=adapted_text,
        )

    except LLMServiceError as exc:
        return Response(
            {
                "detail": str(exc),
            },
            status=status.HTTP_502_BAD_GATEWAY,
        )

    return Response(
        result,
        status=status.HTTP_200_OK,
    )
@api_view(["POST"])
def evaluate_answer(request):
    serializer = EvaluateAnswerSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    question = serializer.validated_data["question"]
    student_answer = serializer.validated_data["student_answer"]
    reference_answer = serializer.validated_data["reference_answer"]

    try:
        result = evaluate_answer_with_ai(
            question=question,
            student_answer=student_answer,
            reference_answer=reference_answer,
        )

    except LLMServiceError as exc:
        return Response(
            {
                "detail": str(exc),
            },
            status=status.HTTP_502_BAD_GATEWAY,
        )

    return Response(
        {
            "question": question,
            "correct": result["correct"],
            "feedback": result["feedback"],
        },
        status=status.HTTP_200_OK,
    )

@api_view(["GET", "PATCH"])
def learner_profile(request):
    demo_user, _ = User.objects.get_or_create(
        username="demo_learner",
        defaults={
            "email": "demo@ddiba.local",
        },
    )

    profile, _ = LearnerProfile.objects.get_or_create(
        user=demo_user
    )

    if request.method == "GET":
        serializer = LearnerProfileSerializer(profile)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )

    serializer = LearnerProfileSerializer(
        profile,
        data=request.data,
        partial=True,
    )

    serializer.is_valid(raise_exception=True)
    serializer.save()

    return Response(
        serializer.data,
        status=status.HTTP_200_OK,
    )

@api_view(["GET"])
def test_api(request):
    return Response({
        "message": "Ddiba backend is connected successfully"
    })