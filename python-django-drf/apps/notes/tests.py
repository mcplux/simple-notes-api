from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken

from apps.notes.models import Note

User = get_user_model()

NOTE_LIST_URL = reverse("notes:list")


def detail_url(pk):
    return reverse("notes:detail", args=[pk])


def set_access_token(user):
    token = RefreshToken.for_user(user)
    return {
        "HTTP_AUTHORIZATION": f"Bearer {token.access_token}",
    }


def make_note(user, title="Test Note", content="Some content"):
    return Note.objects.create(owner=user, title=title, content=content)


class NoteListCreateTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(email="a@example.com", password="pass!")
        self.other = User.objects.create_user(email="b@example.com", password="pass!")

    def test_unauthenticated_request_denied(self):
        res = self.client.get(NOTE_LIST_URL)
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_list_returns_only_own_notes(self):
        make_note(self.user, "Mine")
        make_note(self.other, "Not mine")
        res = self.client.get(NOTE_LIST_URL, **set_access_token(self.user))
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 1)
        self.assertEqual(res.data[0]["title"], "Mine")

    def test_create_note(self):
        payload = {"title": "New Note", "content": "Hello world"}
        res = self.client.post(NOTE_LIST_URL, payload, **set_access_token(self.user))
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Note.objects.filter(owner=self.user).count(), 1)

    def test_create_note_without_title_fails(self):
        res = self.client.post(
            NOTE_LIST_URL, {"content": "no title"}, **set_access_token(self.user)
        )
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)


class NoteDetailTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="owner@example.com", password="pass!"
        )
        self.other = User.objects.create_user(
            email="other@example.com", password="pass!"
        )
        self.note = make_note(self.user, title="Owner's note")

    def test_retrieve_own_note(self):
        res = self.client.get(detail_url(self.note.pk), **set_access_token(self.user))
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data["title"], "Owner's note")

    def test_other_user_cannot_retrieve(self):
        res = self.client.get(detail_url(self.note.pk), **set_access_token(self.other))
        self.assertEqual(res.status_code, status.HTTP_404_NOT_FOUND)

    def test_full_update(self):
        payload = {"title": "Updated", "content": "New content"}
        res = self.client.put(
            detail_url(self.note.pk), payload, **set_access_token(self.user)
        )
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.note.refresh_from_db()
        self.assertEqual(self.note.title, "Updated")

    def test_partial_update(self):
        res = self.client.patch(
            detail_url(self.note.pk),
            {"title": "Patched"},
            **set_access_token(self.user),
        )
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.note.refresh_from_db()
        self.assertEqual(self.note.title, "Patched")

    def test_delete_own_note(self):
        res = self.client.delete(
            detail_url(self.note.pk), **set_access_token(self.user)
        )
        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Note.objects.filter(pk=self.note.pk).exists())

    def test_other_user_cannot_delete(self):
        res = self.client.delete(
            detail_url(self.note.pk), **set_access_token(self.other)
        )
        self.assertEqual(res.status_code, status.HTTP_404_NOT_FOUND)
        self.assertTrue(Note.objects.filter(pk=self.note.pk).exists())
