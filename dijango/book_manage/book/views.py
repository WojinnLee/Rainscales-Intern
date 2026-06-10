from rest_framework.pagination import PageNumberPagination
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Book
from .serializers import BookSerializer


class BookPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = "page_size"
    max_page_size = 100


def custom_filter_books(queryset, request):
    title = request.query_params.get("title")
    author = request.query_params.get("author")
    price = request.query_params.get("price")
    quantity = request.query_params.get("quantity")

    if title:
        queryset = queryset.filter(title__icontains=title)

    if author:
        queryset = queryset.filter(author__icontains=author)

    if price:
        queryset = queryset.filter(price=price)

    if quantity:
        queryset = queryset.filter(quantity=quantity)

    return queryset

class BookViewSet(viewsets.ModelViewSet):
    serializer_class = BookSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = BookPagination

    def get_queryset(self):
        queryset = Book.objects.all().order_by("id")
        queryset = custom_filter_books(queryset, self.request)
        return queryset