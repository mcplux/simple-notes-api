from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.token_blacklist.models import (
    BlacklistedToken,
    OutstandingToken,
)
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

REGISTER_URL = reverse("accounts:register")
LOGIN_URL = reverse("accounts:login")
REFRESH_URL = reverse("accounts:refresh")
LOGOUT_URL = reverse("accounts:logout")
ME_URL = reverse("accounts:me")

email = "test@test.com"
password = "StrongPass123"
first_name = "Juan"
last_name = "Martinez"


def set_access_token(user):
    token = RefreshToken.for_user(user)
    return {
        "HTTP_AUTHORIZATION": f"Bearer {token.access_token}",
    }


class RegisterTests(APITestCase):
    def test_register_success(self):
        payload = {
            "email": email,
            "first_name": first_name,
            "last_name": last_name,
            "password": password,
        }
        res = self.client.post(REGISTER_URL, payload)
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(email=email).exists())

    def test_register_duplicate_email(self):
        User.objects.create_user(email=email, password="password")
        payload = {
            "email": email,
            "password": password,
        }
        res = self.client.post(REGISTER_URL, payload)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)


class LoginTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(email=email, password=password)

    def test_login_success(self):
        res = self.client.post(LOGIN_URL, {"email": email, "password": password})
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn("access", res.data)
        self.assertIn("refresh", res.data)

    def test_login_wrong_password(self):
        res = self.client.post(LOGIN_URL, {"email": email, "password": "wrong"})
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_login_unknown_email(self):
        res = self.client.post(
            LOGIN_URL, {"email": "nobody@example.com", "password": "pass"}
        )
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)


class RefreshTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(email=email, password=password)
        self.refresh = RefreshToken.for_user(self.user)

    def test_refresh_success(self):
        res = self.client.post(REFRESH_URL, {"refresh": self.refresh})
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn("access", res.data)
        self.assertIn("refresh", res.data)
        self.assertNotEqual(res.data["refresh"], self.refresh)

    def test_refresh_token_blacklisted(self):
        self.client.post(REFRESH_URL, {"refresh": self.refresh})
        outstanding = OutstandingToken.objects.get(token=self.refresh)
        is_blacklisted = BlacklistedToken.objects.filter(token=outstanding).exists()
        self.assertTrue(is_blacklisted)


class LogoutTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(email=email, password=password)
        self.refresh = RefreshToken.for_user(self.user)

    def test_logout_success_and_token_blacklisted(self):
        res = self.client.post(LOGOUT_URL, {"refresh": self.refresh})
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        outstanding = OutstandingToken.objects.get(token=self.refresh)
        is_blacklisted = BlacklistedToken.objects.filter(token=outstanding).exists()
        self.assertTrue(is_blacklisted)


class MeTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email=email, first_name=first_name, password=password
        )

    def test_me_authenticated(self):
        res = self.client.get(ME_URL, **set_access_token(self.user))
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data["email"], email)
        self.assertEqual(res.data["first_name"], first_name)

    def test_me_unauthenticated(self):
        res = self.client.get(ME_URL)
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)
