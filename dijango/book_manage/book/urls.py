from django.urls import include
from django.urls import path
from .auth_views import LogoutView
from .views import BookViewSet
from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register(r"books", BookViewSet, basename="book")

urlpatterns = [
    path("logout/", LogoutView.as_view(), name="logout"),
    path("", include(router.urls)),
]
