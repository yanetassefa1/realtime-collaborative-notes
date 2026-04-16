from django.urls import path
from .views import NoteListCreateView, NoteDetailView, share_note, remove_collaborator

urlpatterns = [
    path("", NoteListCreateView.as_view(), name="note-list-create"),
    path("<uuid:pk>/", NoteDetailView.as_view(), name="note-detail"),
    path("<uuid:pk>/share/", share_note, name="note-share"),
    path("<uuid:pk>/collaborators/<int:user_id>/", remove_collaborator, name="remove-collaborator"),
]
