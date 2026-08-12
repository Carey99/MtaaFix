import logging
from django.db import models
from django.contrib.auth import get_user_model
import uuid

logger = logging.getLogger(__name__)

User = get_user_model()

class Job(models.Model):
    CATEGORY_CHOICES = [
        ('plumbing', 'Plumbing'),
        ('electrical', 'Electrical'),
        ('moving', 'Moving'),
        ('cleaning', 'Cleaning'),
        ('fumigation', 'Fumigation'),
        ('installation', 'Installation'),
        ('carpentry', 'Carpentry'),
        ('delivery', 'Delivery'),
        ('other', 'Other'),
    ]
    
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('assigned', 'Assigned'),
        ('in_progress', 'In progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    client = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posted_jobs')
    assigned_worker = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_jobs')
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    location = models.CharField(max_length=200)
    budget = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deadline = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'jobs'
        ordering = ['-created_at']
        
    def __str__(self):
        return f"{self.title} by {self.client.name}"

    def save(self, *args, **kwargs):
        logger.debug(f"Saving Job id={self.id} title={self.title!r} status={self.status}")
        try:
            super().save(*args, **kwargs)
            logger.info(f"Job saved successfully id={self.id}")
        except Exception:
            logger.exception(f"Failed to save Job id={self.id} title={self.title!r}")
            raise
    
class JobApplication(models.Model):
    STATUS_CHOICES = [
        ('applied', 'Applied'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='applications')
    worker = models.ForeignKey(User, on_delete=models.CASCADE, related_name='job_applications')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='applied')
    amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    message = models.TextField(blank=True, null=True)
    applied_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'job_applications'
        unique_together = ('job', 'worker') #can't apply twice on same job
        
    def __str__(self):
        return f"{self.worker.last_name} applied for {self.job.title}"

    def save(self, *args, **kwargs):
        logger.debug(f"Saving JobApplication id={self.id} job_id={self.job_id} worker_id={self.worker_id} status={self.status}")
        try:
            super().save(*args, **kwargs)
            logger.info(f"JobApplication saved successfully id={self.id}")
        except Exception:
            logger.exception(f"Failed to save JobApplication id={self.id} job_id={self.job_id} worker_id={self.worker_id}")
            raise