from django.test import TestCase
from django.contrib.auth import get_user_model
from .models import Job, JobApplication
from .serializers import JobApplicationSerializer

User = get_user_model()


class JobApplicationSerializerTests(TestCase):
    def test_serializer_returns_nested_job_details_for_worker_applications(self):
        client = User.objects.create_user(
            phone='254700000001',
            password='secret123',
            name='Client One',
            role='client',
        )
        worker = User.objects.create_user(
            phone='254700000002',
            password='secret123',
            name='Worker One',
            role='worker',
        )
        job = Job.objects.create(
            client=client,
            title='Fix kitchen sink',
            description='Leaky sink',
            category='plumbing',
            location='Nairobi',
            budget='2500.00',
            status='open',
        )
        application = JobApplication.objects.create(job=job, worker=worker)

        serializer = JobApplicationSerializer(application)
        payload = serializer.data

        self.assertEqual(payload['job']['title'], 'Fix kitchen sink')
        self.assertEqual(payload['job']['location'], 'Nairobi')
        self.assertEqual(payload['worker']['name'], 'Worker One')
        self.assertEqual(payload['status'], 'applied')
        self.assertEqual(payload['job']['status'], 'open')
