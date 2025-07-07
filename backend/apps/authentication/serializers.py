from rest_framework import serializers
from djoser.serializers import UserCreateSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

class UserCreateSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = "__all__"

class UserSerializer(serializers.ModelSerializer):
    #profile_picture = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = [
            "username",
            "first_name",
            "last_name",
            "role",
            "updated_at",
        ]

class UserPublicSerializer(serializers.ModelSerializer):
    #profile_picture = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "username",
            "first_name",
            "last_name",
            "updated_at",
            "role",
        ]