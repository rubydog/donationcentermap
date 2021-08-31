from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('details/<slug:slug>/', views.detailsPage, name='detailsPage'),
    path('input-center/', views.inputCenterPage, name='inputCenterPage')
]