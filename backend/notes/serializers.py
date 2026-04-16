from rest_framework import serializers
from .models import Note
from users.serializers import UserSerializer


class NoteSerializer(serializers.ModelSerializer):
    owner_name = serializers.SerializerMethodField()
    collaborator_count = serializers.SerializerMethodField()

    class Meta:
        model = Note
        fields = [
            "id", "owner", "owner_name", "title", "content",
            "tags", "is_public", "collaborators", "collaborator_count",
            "created_at", "updated_at",
        ]
        read_only_fields = ["id", "owner", "created_at", "updated_at"]

    def get_owner_name(self, obj):
        return obj.owner.get_full_name() or obj.owner.email

    def get_collaborator_count(self, obj):
        return obj.collaborators.count()


class NoteListSerializer(serializers.ModelSerializer):
    owner_name = serializers.SerializerMethodField()
    collaborator_count = serializers.SerializerMethodField()

    class Meta:
        model = Note
        fields = ["id", "title", "tags", "is_public", "owner", "owner_name", "collaborator_count", "created_at", "updated_at"]
        read_only_fields = ["id", "owner", "created_at", "updated_at"]

    def get_owner_name(self, obj):
        return obj.owner.get_full_name() or obj.owner.email

    def get_collaborator_count(self, obj):
        return obj.collaborators.count()
