from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from locations.models import Region
from partners.models import PartnerProfile

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    business_name = serializers.CharField(required=False, allow_blank=True)
    activity_type = serializers.CharField(required=False, allow_blank=True)
    description = serializers.CharField(required=False, allow_blank=True)
    address = serializers.CharField(required=False, allow_blank=True)
    region_id = serializers.IntegerField(required=False)
    latitude = serializers.DecimalField(max_digits=9, decimal_places=6, required=False)
    longitude = serializers.DecimalField(max_digits=9, decimal_places=6, required=False)

    class Meta:
        model = User
        fields = [
            "username",
            "password",
            "email",
            "full_name",
            "phone",
            "role",
            "business_name",
            "activity_type",
            "description",
            "address",
            "region_id",
            "latitude",
            "longitude",
        ]

    def validate_role(self, value):
        if value not in ["user", "partner"]:
            raise serializers.ValidationError("role doit être 'user' ou 'partner'.")
        return value

    def validate(self, attrs):
        role = attrs.get("role", "user")

        if role == "partner":
            required_fields = ["business_name", "activity_type", "description", "address"]
            missing = [field for field in required_fields if not attrs.get(field)]
            if missing:
                raise serializers.ValidationError(
                    {
                        "error": f"Pour un partner, les champs suivants sont obligatoires : {', '.join(missing)}."
                    }
                )

        return attrs

    def create(self, validated_data):
        business_name = validated_data.pop("business_name", None)
        activity_type = validated_data.pop("activity_type", None)
        description = validated_data.pop("description", None)
        address = validated_data.pop("address", None)
        region_id = validated_data.pop("region_id", None)
        latitude = validated_data.pop("latitude", None)
        longitude = validated_data.pop("longitude", None)

        password = validated_data.pop("password")

        user = User.objects.create_user(password=password, **validated_data)

        if user.role == "partner":
            region = Region.objects.filter(pk=region_id).first() if region_id else None

            PartnerProfile.objects.create(
                user=user,
                business_name=business_name,
                activity_type=activity_type,
                description=description,
                address=address,
                region=region,
                latitude=latitude,
                longitude=longitude,
            )

        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["username"] = user.username
        token["role"] = user.role
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user
        data["user"] = {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "full_name": user.full_name,
            "phone": user.phone,
            "role": user.role,
            "is_staff": user.is_staff,
            "is_superuser": user.is_superuser,
        }
        return data