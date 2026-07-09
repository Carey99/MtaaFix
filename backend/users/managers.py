from django.contrib.auth.models import BaseUserManager


class CustomUserManager(BaseUserManager):
    
    def create_user(self, phone, password=None, **extra_fields):
        if not phone:
            raise ValueError('Phone number required')
        # Generate username from phone to avoid conflicts with AbstractUser
        extra_fields.setdefault('username', phone)
        user = self.model(phone=phone, **extra_fields)
        user.set_password(password)
        user.save(using=self.db)
        return user
    
    def create_superuser(self, phone, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(phone, password, **extra_fields)