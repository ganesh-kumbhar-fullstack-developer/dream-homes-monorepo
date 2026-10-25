from rest_framework import serializers

from accounts.models import User


class OTPRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()


class OTPVerifySerializer(serializers.Serializer):
    email = serializers.EmailField()
    code = serializers.RegexField(
        r"^[0-9]{6}$", error_messages={"invalid": "Enter the 6-digit code"}
    )
    full_name = serializers.CharField(required=False, allow_blank=True, max_length=150)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email", "full_name", "phone", "role"]
        read_only_fields = ["id", "email", "role"]


class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()
