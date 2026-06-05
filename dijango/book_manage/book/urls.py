from django.urls import include
from django.urls import path
from .views import BookViewSet
from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register(r'books', BookViewSet,basename="book")

urlpatterns = [
    path("", include(router.urls)),
]
