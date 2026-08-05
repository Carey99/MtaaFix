from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Job, JobApplication
from .serializers import JobSerializer, JobApplicationSerializer


class JobListView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        #workers: GET list of all jobs(filter by query params)
        jobs = Job.objects.filter(status='open')
        serializer = JobSerializer(jobs, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        #CLIENTS: POST create a new job
        serializer = JobSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(client=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class JobDetailView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, job_id):
        try:
            job = Job.objects.get(id=job_id)
        except Job.DoesNotExist:
            return Response({'error': 'Job not found'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = JobSerializer(job)
        return Response(serializer.data)

# Get user's jobs (clients) or applications (workers)
class MyJobView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        #Clients: GET their posted jobs
        #Workers: GET their applications
        if request.user.role == 'client':
            jobs = Job.objects.filter(client=request.user)
            serializer = JobSerializer(jobs, many=True)
        else: #worker
            apps = JobApplication.objects.filter(worker=request.user)
            serializer = JobApplicationSerializer(apps, many=True)
        return Response(serializer.data)
    
class JobApplicationView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        # Workers: POST apply for a job
        serializer = JobApplicationSerializer(data=request.data)
        if serializer.is_valid():
            job = serializer.validated_data['job']
            if JobApplication.objects.filter(job=job, worker=request.user).exists():
                return Response({'detail': 'You have already applied for this job.'}, status=status.HTTP_400_BAD_REQUEST)

            serializer.save(worker=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#Get applications for a specific job
class JobApplicationsForJobView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, job_id):
        #Clients: see who applied for their job
        try:
            job = Job.objects.get(id=job_id, client=request.user)
        except Job.DoesNotExist:
            return Response({'error': 'Job not found or not yours'}, status=status.HTTP_404_NOT_FOUND)
        
        applications = JobApplication.objects.filter(job=job)
        serializer = JobApplicationSerializer(applications, many=True)
        return Response(serializer.data)
    
    def put(self, request, job_id):
        #clients: accept/reject applications
        
        try:
            app = JobApplication.objects.get(id=request.data.get('application_id'))
        except JobApplication.DoesNotExist:
            return Response({'error': 'Application not found'}, status=status.HTTP_404_NOT_FOUND)
        
        app.status = request.data.get('status') #'accepted' or 'rejected'
        app.save()
        
        serializer = JobApplicationSerializer(app)
        return Response(serializer.data)