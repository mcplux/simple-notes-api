from rest_framework import serializers

from .models import Note


class NoteSerializer(serializers.ModelSerializer):
    owner = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Note
        fields = ("id", "owner", "title", "content", "created_at", "updated_at")
        read_only_fields = ("id", "owner", "created_at", "updated_at")


class NoteWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ("title", "content")
