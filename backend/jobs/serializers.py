from rest_framework import serializers
from .models import Job, JobApplication
from users.serializers import UserSerializer

class JobSerializer(serializers.ModelSerializer):
    client = UserSerializer(read_only=True)
    applications_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Job
        fields = ['id', 'client', 'title', 'description', 'category',
                  'location', 'budget', 'status', 'created_at', 'applications_count']
        
    def get_applications_count(self, obj):
        return obj.applications.count()
        
class JobApplicationSerializer(serializers.ModelSerializer):
    worker = UserSerializer(read_only=True)
    
    class Meta:
        model = JobApplication
        fields = ['id', 'job', 'worker', 'status', 'message', 'applied_at']