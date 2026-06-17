from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import render

from .models import Book
from .serializers import BookSerializer
from .filters import filter_books
from .pagination import BookPagination


class BookViewSet(viewsets.ModelViewSet):
    serializer_class = BookSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = BookPagination

    def get_queryset(self):
        queryset = Book.objects.all().order_by("id")
        return filter_books(queryset, self.request.query_params)


def home(request):
    return render(request, "book/home.html")
