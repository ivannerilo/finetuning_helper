from django.db import models
from django.contrib.auth.models import User
from django.contrib.sessions.models import Session

# Create your models here.


class FileUser(models.Model):
    file = models.FileField(upload_to="files/")
    user_session = models.CharField(max_length=255)
    file_name = models.CharField(max_length=255, unique=True)

    def save(self, *args, **kwargs):
        if self.file:
            self.file_name = self.file.name.split('/')[-1]
        super().save(*args, **kwargs)