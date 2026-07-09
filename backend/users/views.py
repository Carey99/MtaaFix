from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterSerializer, LoginSerializer, PasswordResetRequestSerializer, PasswordResetConfirmSerializer
from .models import PasswordResetOTP, User
import random

def get_tokens(user):
    refresh = RefreshToken.for_user(user)
    return {
        'access': str(refresh.access_token), #60min
        'refresh': str(refresh), #7days
    }
    
class RegisterView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        s = RegisterSerializer(data=request.data)
        if s.is_valid():
            user = s.save()
            return Response({
                'user': {'id': str(user.id), 'phone': user.phone,
                         'name': user.name, 'role': user.role},
                'tokens': get_tokens(user),
            }, status=status.HTTP_201_CREATED)
        return Response(s.errors, status=status.HTTP_400_BAD_REQUEST)
    
class LoginView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        s = LoginSerializer(data=request.data)
        if s.is_valid():
            user = s.validated_data['user']
            return Response({
                'user': {'id': str(user.id), 'phone': user.phone,
                         'name': user.name, 'role': user.role},
                'tokens': get_tokens(user),
            }, status=status.HTTP_200_OK)
        return Response(s.errors, status=status.HTTP_400_BAD_REQUEST)
    
class MeView(APIView):
    permission_classes = [IsAuthenticated] #JWT required
    
    def get(self, request):
        u = request.user
        return Response({'id': str(u.id), 'phone': u.phone,
                         'name': u.name, 'role': u.role})
        
class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        if serializer.is_valid():
            phone =  serializer.validated_data['phone']
            
            PasswordResetOTP.objects.filter(
                phone=phone, is_used=False
            ).update(is_used=True)
            
            
            #Generate fresh OTP
            otp =  str(random.randint(100000, 999999))
            PasswordResetOTP.objects.create(phone=phone, otp=otp)
            
            #Dev mode for testing use email service
            return Response({
                'message': 'OTP sent to your phone',
                'dev_otp': otp, #exclude in prod
            }, status=status.HTTP_200_OK) 
        return Response(serializer.errors, status.HTTP_400_BAD_REQUEST)
    
    
class PasswordResetConfirm(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        if serializer.is_valid():
            phone       = serializer.validated_data['phone']
            otp_reccord = serializer.validated_data['otp_record']
            new_pass    = serializer.validated_data['new_passsword']
            
            #Set the new hashed password
            user = User.objects.get(phone=phone)
            user.set_password(new_pass)
            user.save()
            
            #Mark otp as used and cannot be reused
            otp_reccord.is_used = True
            otp_reccord.save()
            
            return Response(
                {'message': 'Password reset successfully. Please log in'},
                status=status.HTTP_200_OK
            )
       
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            