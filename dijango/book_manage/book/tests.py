from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Book


class BookApiTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="tester",
            password="strong-password",
        )
        self.client.force_authenticate(user=self.user)

    def test_book_crud_flow(self):
        create_response = self.client.post(
            "/api/books/",
            {
                "title": "Clean Code",
                "author": "Robert C. Martin",
                "price": 25.5,
                "quantity": 10,
            },
            format="json",
        )
        self.assertEqual(create_response.status_code, status.HTTP_201_CREATED)
        book_id = create_response.data["id"]

        detail_response = self.client.get(f"/api/books/{book_id}/")
        self.assertEqual(detail_response.status_code, status.HTTP_200_OK)
        self.assertEqual(detail_response.data["title"], "Clean Code")

        update_response = self.client.put(
            f"/api/books/{book_id}/",
            {
                "title": "Clean Code Updated",
                "author": "Robert C. Martin",
                "price": 30,
                "quantity": 12,
            },
            format="json",
        )
        self.assertEqual(update_response.status_code, status.HTTP_200_OK)
        self.assertEqual(update_response.data["quantity"], 12)

        delete_response = self.client.delete(f"/api/books/{book_id}/")
        self.assertEqual(delete_response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Book.objects.filter(id=book_id).exists())

    def test_books_can_be_filtered_and_paginated(self):
        books = [
            Book(title=f"Django {index}", author="Author A", price=10, quantity=5)
            for index in range(25)
        ]
        books.append(Book(title="React Guide", author="Author B", price=15, quantity=3))
        Book.objects.bulk_create(books)

        page_response = self.client.get("/api/books/?page=2&page_size=20")
        self.assertEqual(page_response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(page_response.data["results"]), 6)
        self.assertEqual(page_response.data["count"], 26)

        filter_response = self.client.get("/api/books/?title=React&author=Author+B")
        self.assertEqual(filter_response.status_code, status.HTTP_200_OK)
        self.assertEqual(filter_response.data["count"], 1)
        self.assertEqual(filter_response.data["results"][0]["title"], "React Guide")

    def test_books_require_authentication(self):
        self.client.force_authenticate(user=None)
        response = self.client.get("/api/books/")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class LogoutApiTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="tester",
            password="strong-password",
        )

    def test_logout_blacklists_refresh_token(self):
        refresh = RefreshToken.for_user(self.user)
        access = refresh.access_token

        response = self.client.post(
            reverse("logout"),
            {"refresh": str(refresh)},
            format="json",
            HTTP_AUTHORIZATION=f"Bearer {access}",
        )

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        refresh_response = self.client.post(
            reverse("token_refresh"),
            {"refresh": str(refresh)},
            format="json",
        )
        self.assertEqual(refresh_response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_logout_requires_refresh_token(self):
        refresh = RefreshToken.for_user(self.user)
        access = refresh.access_token

        response = self.client.post(
            reverse("logout"),
            {},
            format="json",
            HTTP_AUTHORIZATION=f"Bearer {access}",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
