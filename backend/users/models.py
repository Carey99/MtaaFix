import uuid
import random
from django.contrib.auth.models import AbstractUser, PermissionsMixin
from django.db import models
from django.utils import timezone
from .managers import CustomUserManager

#handles both clients and workers

class User(AbstractUser, PermissionsMixin):
    
    ROLES = [
        ('client', 'client'),
        ('worker', 'worker')
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    phone = models.CharField(max_length=15, unique=True, default='')
    name = models.CharField(max_length=100, default='')
    role = models.CharField(max_length=10, choices=ROLES, default='client')
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)
    
    USERNAME_FIELD = 'phone' #login with phone, not username
    REQUIRED_FIELDS = ['name']
    
    objects = CustomUserManager()
    
    class Meta:
        db_table = 'users'
        
    def __str__(self):
        return f"{self.name} ({self.phone})"
    
class PasswordResetOTP(models.Model):
    phone      = models.CharField(max_length=15)
    otp        = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    is_used    = models.BooleanField(default=False)
    
    class Meta:
        db_table = 'password_reset_otps'
        
    def is_expired(self):
        from django.utils import timezone
        from datetime import timedelta
        return timezone.now() > self.created_at + timedelta(minutes=5)
    
    def __str__(self):
        return f"OTP for {self.phone}"
        