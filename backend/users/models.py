from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError
from django.db import models

class User(AbstractUser):
  email = models.EmailField(unique=True, blank=True, null=True)
  first_name = models.CharField(max_length=50, blank=True, null=True)
  last_name = models.CharField(max_length=50, blank=True, null=True)

  USERNAME_FIELD = 'username'
  REQUIRED_FIELDS = []

  def save(self, *args, **kwargs):
    if self.username:
      if self.pk and User.objects.filter(username=self.username).exclude(pk=self.pk).exists():
        raise ValidationError('Пользователь с таким username уже существует.')
    super().save(*args, **kwargs)

  def __str__(self):
      return self.username

