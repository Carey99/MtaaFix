import re
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import authenticate
from .models import User, PasswordResetOTP


class RegisterSerializer(serializers.ModelSerializer):
    password         = serializers.CharField(write_only=True, validators=[validate_password])
    confirm_password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['phone', 'name', 'role', 'password', 'confirm_password']
        
    def validate_phone(self, value):
        if not re.match(r'^(?:254|\+254|0)7[0-9]{8}$', value):
            raise serializers.ValidationError('Enter a valid phone nummber')
        return value
    
    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError(
                {'confirm_password': 'Passwords do not match.'}
            )
        return data
    
    def create(self, validated_data):
        validated_data.pop('confirm_password')
        return User.objects.create_user(**validated_data)
    
class LoginSerializer(serializers.Serializer):
    phone    = serializers.CharField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, data):
        user = authenticate(username=data['phone'], password=data['password'])
        
        if not user:
            raise serializers.ValidationError('Wrong phone or password.')
        if not user.is_active:
            raise serializers.ValidationError('Account is deactivated.')
        data['user'] = user
        return data
    
class PasswordResetRequestSerializer(serializers.Serializer):
    phone = serializers.CharField()
    
    def validate_phone(self, value):
        if not User.objects.filter(phone=value).exists():
            raise serializers.ValidationError(
                'No account with this phone number found.'
            )
        return value
    
class PasswordResetConfirmSerializer(serializers.Serializer):
    phone        = serializers.CharField()
    otp          = serializers.CharField(max_length=6)
    new_password = serializers.CharField(write_only=True, validators=[validate_password])
    
    def validate(self, data):
        try:
            otp_record = PasswordResetOTP.objects.filter(
                phone=data['phone'],
                otp=data['otp'],
                is_used=False,
            ).latest('created_at')
        except PasswordResetOTP.DoesNotExist:
            raise serializers.ValidationError({'otp': 'Invalid otp'})
        
        if otp_record.is_expired():
            raise serializers.ValidationError(
                {'otp': 'OTP expired. Request a new one.'}
            )
            
        data['otp_record'] = otp_record
        return data

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'phone', 'name', 'role']