from django.urls import path

from .views import NoteDetailView, NoteListCreateView

app_name = "notes"

urlpatterns = [
    path("notes", NoteListCreateView.as_view(), name="list"),
    path("notes/<int:pk>", NoteDetailView.as_view(), name="detail"),
]
