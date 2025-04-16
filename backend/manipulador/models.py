from django.db import models
from django.contrib.auth.models import User
from django.contrib.sessions.models import Session
from django.core.exceptions import ValidationError
import mimetypes
# Create your models here.


class FileUser(models.Model):
    file = models.FileField(upload_to="files/")
    user_session = models.CharField(max_length=255)
    file_name = models.CharField(max_length=255, unique=True)

    # def clean(self):
    #     if not self.file.name.endswith(".jsonl"):
    #         raise ValidationError("Arquivo precisa ser JSONL.")

    #     mime_type, encoding = mimetypes.guess_type(self.file.name)
    #     if mime_type != "application/json":
    #         raise ValidationError("Arquivo precisa ser JSONL.")


    def save(self, *args, **kwargs):
        if self.file:
            self.file_name = self.file.name.split('/')[-1]
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        self.file.delete(save=False)
        super().delete(*args, **kwargs)