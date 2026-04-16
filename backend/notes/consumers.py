import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Note
from django.db.models import Q


class NoteConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.note_id = self.scope["url_route"]["kwargs"]["note_id"]
        self.room_group_name = f"note_{self.note_id}"
        self.user = self.scope["user"]

        # Check access
        if not await self.has_access():
            await self.close()
            return

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

        # Notify others a user joined
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "user_join",
                "user_id": self.user.id,
                "username": self.user.get_full_name() or self.user.email,
                "color": self.user.avatar_color,
            },
        )

    async def disconnect(self, close_code):
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "user_leave",
                "user_id": self.user.id,
                "username": self.user.get_full_name() or self.user.email,
            },
        )
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        event_type = data.get("type")

        if event_type == "content_update":
            # Save to DB and broadcast
            await self.save_content(data.get("content", ""), data.get("title", ""))
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "content_update",
                    "content": data.get("content", ""),
                    "title": data.get("title", ""),
                    "user_id": self.user.id,
                    "username": self.user.get_full_name() or self.user.email,
                },
            )

        elif event_type == "cursor_move":
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "cursor_move",
                    "user_id": self.user.id,
                    "username": self.user.get_full_name() or self.user.email,
                    "color": self.user.avatar_color,
                    "position": data.get("position", 0),
                },
            )

    # Handlers — send to WebSocket client
    async def content_update(self, event):
        if event["user_id"] != self.user.id:
            await self.send(text_data=json.dumps(event))

    async def cursor_move(self, event):
        if event["user_id"] != self.user.id:
            await self.send(text_data=json.dumps(event))

    async def user_join(self, event):
        await self.send(text_data=json.dumps(event))

    async def user_leave(self, event):
        await self.send(text_data=json.dumps(event))

    @database_sync_to_async
    def has_access(self):
        try:
            Note.objects.get(
                Q(id=self.note_id),
                Q(owner=self.user) | Q(collaborators=self.user) | Q(is_public=True),
            )
            return True
        except Note.DoesNotExist:
            return False

    @database_sync_to_async
    def save_content(self, content, title):
        Note.objects.filter(id=self.note_id).update(content=content, title=title or "Untitled")
