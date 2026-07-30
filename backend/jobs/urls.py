from django.urls import path
from . import views

urlpatterns = [
    path('', views.JobListView.as_view(), name='job-list'), #GET all / POST new
    path('<uuid:job_id>/', views.JobDetailView.as_view(), name='job-detail'),
    path('my-jobs/', views.MyJobView.as_view(), name='my-jobs'),
    
    #Application endpoints
    path('applications/', views.JobApplicationView.as_view(), name='apply'),
    path('applications/<uuid:job_id>/', views.JobApplicationsForJobView.as_view(), name='job-applications'),
]