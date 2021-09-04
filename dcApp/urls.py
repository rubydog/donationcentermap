from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('details/<slug:slug>/', views.detailsPage, name='detailsPage'),
    path('input-center/', views.inputCenterPage, name='inputCenterPage'),
    
    # Api
    path('api/centers/', views.api_centers, name='api_centers'),
    path('api/centers/filter/', views.filter_api_centers, name='filter_api_centers'),
]