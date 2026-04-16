from rest_framework import generics, permissions, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from django.db.models import Q
from .models import Note
from .serializers import NoteSerializer, NoteListSerializer
from users.models import User


class NoteListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["title", "content", "tags"]
    ordering_fields = ["updated_at", "created_at", "title"]

    def get_serializer_class(self):
        if self.request.method == "GET":
            return NoteListSerializer
        return NoteSerializer

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(
            Q(owner=user) | Q(collaborators=user)
        ).distinct()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class NoteDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = NoteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(
            Q(owner=user) | Q(collaborators=user) | Q(is_public=True)
        ).distinct()

    def perform_update(self, serializer):
        note = self.get_object()
        user = self.request.user
        if note.owner != user and user not in note.collaborators.all():
            raise PermissionDenied("You don't have permission to edit this note.")
        serializer.save()

    def perform_destroy(self, instance):
        if instance.owner != self.request.user:
            raise PermissionDenied("Only the owner can delete this note.")
        instance.delete()


@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def share_note(request, pk):
    try:
        note = Note.objects.get(pk=pk, owner=request.user)
    except Note.DoesNotExist:
        return Response({"error": "Note not found or you are not the owner."}, status=404)

    email = request.data.get("email")
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({"error": "User with this email not found."}, status=404)

    note.collaborators.add(user)
    return Response({"message": f"Note shared with {email}."})


@api_view(["DELETE"])
@permission_classes([permissions.IsAuthenticated])
def remove_collaborator(request, pk, user_id):
    try:
        note = Note.objects.get(pk=pk, owner=request.user)
    except Note.DoesNotExist:
        return Response({"error": "Note not found."}, status=404)
    note.collaborators.remove(user_id)
    return Response({"message": "Collaborator removed."})
