from rest_framework.decorators import api_view
from rest_framework.response import Response
from .ai_services import adapt_content

@api_view(["POST"])
def adapt_lesson(request):
    text = request.data.get("text")
    mode = request.data.get("mode", "simplify")

    if not text:
        return Response({"error": "No text provided"}, status=400)

    adapted = adapt_content(text, mode)
    return Response({"adapted_text": adapted})