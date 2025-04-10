from rest_framework import serializers
from .models import FileUser

class FileUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = FileUser
        fields = '__all__'