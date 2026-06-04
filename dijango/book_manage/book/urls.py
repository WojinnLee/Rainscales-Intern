from django.urls import path
from . import views
from .views import BookListCreateAPIView, BookDetailAPIView

urlpatterns = [
    path("books/", BookListCreateAPIView.as_view(), name="book-list-create"),
    path("books/<int:id>/", BookDetailAPIView.as_view(), name="book-detail"),
]
