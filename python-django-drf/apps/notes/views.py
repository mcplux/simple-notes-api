from drf_spectacular.utils import extend_schema, extend_schema_view
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import BasePermission, IsAuthenticated

from .models import Note
from .serializers import NoteSerializer, NoteWriteSerializer


class IsOwner(BasePermission):
    """Object-level permission: only the owner may access it."""

    def has_object_permission(self, request, view, obj):
        return obj.owner == request.user


@extend_schema_view(
    get=extend_schema(summary="List notes", tags=["Notes"]),
    post=extend_schema(summary="Create a note", tags=["Notes"]),
)
class NoteListCreateView(ListCreateAPIView):
    """List all notes for the current user, or create a new one."""

    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == "POST":
            return NoteWriteSerializer
        return NoteSerializer

    def get_queryset(self):
        return Note.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


@extend_schema_view(
    get=extend_schema(summary="Retrieve a note", tags=["Notes"]),
    put=extend_schema(summary="Update a note (full)", tags=["Notes"]),
    patch=extend_schema(summary="Update a note (partial)", tags=["Notes"]),
    delete=extend_schema(summary="Delete a note", tags=["Notes"]),
)
class NoteDetailView(RetrieveUpdateDestroyAPIView):
    """Retrieve, update, or delete a note owned by the current user."""

    permission_classes = [IsAuthenticated, IsOwner]

    def get_serializer_class(self):
        if self.request.method in ("PUT", "PATCH"):
            return NoteWriteSerializer
        return NoteSerializer

    def get_queryset(self):
        return Note.objects.filter(owner=self.request.user)
